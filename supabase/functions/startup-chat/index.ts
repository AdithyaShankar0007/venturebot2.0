import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are StartupGPT, an expert startup advisor and idea validator. Your role is to help entrepreneurs evaluate their startup ideas with brutal honesty and actionable insights.

When a user submits a startup idea, you should:

1. **Analyze Viability**: Evaluate the idea across these dimensions:
   - Market Size & Opportunity (TAM, SAM, SOM)
   - Problem-Solution Fit
   - Competitive Landscape
   - Business Model Potential
   - Technical Feasibility
   - Team Requirements

2. **Identify Similar Products**: Research and list 3-5 existing products/competitors that are solving similar problems. For each, include:
   - Name and brief description
   - How they compare to the proposed idea
   - Their funding status if known
   - What the user can learn from them

3. **Provide a Viability Score**: Rate the idea from 1-10 with clear reasoning

4. **Give Actionable Next Steps**: Suggest 3-5 concrete actions the user should take

Format your responses with clear headers and bullet points. Be encouraging but honest. If an idea has significant challenges, explain them clearly while suggesting potential pivots or improvements.

If the user asks general questions about startups (fundraising, MVPs, team building, etc.), provide expert guidance based on best practices from YC, a16z, and other top accelerators.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});