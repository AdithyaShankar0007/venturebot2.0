import { useState, useRef, useEffect } from "react";
import { Message, streamChat } from "@/lib/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestedPrompts } from "@/components/SuggestedPrompts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
      });
    };

    await streamChat({
      messages: [...messages, userMessage],
      onDelta: updateAssistant,
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      },
    });
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl w-full mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">VentureBot</h1>
              <p className="text-xs text-muted-foreground">Validate your startup ideas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="text-center mb-8 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  <span className="gradient-text">Validate Your</span>
                  <br />
                  <span className="text-foreground">Startup Idea</span>
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get expert analysis on viability, discover competitors, and receive actionable insights to launch faster.
                </p>
              </div>
              
              <div className="w-full max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <p className="text-sm text-muted-foreground mb-3 text-center">Ask about:</p>
                <SuggestedPrompts onSelect={handleSend} />
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isLoading && message.role === "assistant" && message.id === messages[messages.length - 1]?.id}
              />
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-6 px-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ChatInput
                onSend={handleSend}
                disabled={isLoading}
                placeholder={messages.length === 0 ? "Describe your startup idea..." : "Ask a follow-up question..."}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            VentureBot provides analysis based on market research. Always validate with real customers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
