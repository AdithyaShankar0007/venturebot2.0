import { Rocket, TrendingUp, Users, Coins } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    icon: Rocket,
    title: "Validate my idea",
    prompt: "I want to build an app that helps remote teams track their productivity and collaborate better. Can you analyze this idea?",
  },
  {
    icon: TrendingUp,
    title: "Find competitors",
    prompt: "What are the main competitors in the AI-powered customer support space? I'm thinking of building a chatbot for e-commerce.",
  },
  {
    icon: Users,
    title: "Build an MVP",
    prompt: "What's the fastest way to build and launch an MVP for a B2B SaaS product?",
  },
  {
    icon: Coins,
    title: "Funding advice",
    prompt: "How should I approach fundraising as a first-time founder? What do VCs look for?",
  },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(suggestion.prompt)}
            className="group flex items-center gap-3 p-4 rounded-xl glass-panel hover:bg-secondary/50 transition-all duration-200 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {suggestion.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}