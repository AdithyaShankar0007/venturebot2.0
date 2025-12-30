import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Message, streamChat } from "@/lib/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestedPrompts } from "@/components/SuggestedPrompts";
import { SavedIdeas } from "@/components/SavedIdeas";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useStartupIdeas } from "@/hooks/useStartupIdeas";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, LogIn, LogOut, Save, Menu, X, Lightbulb, Loader2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { ideas, loading: ideasLoading, saveIdea, deleteIdea } = useStartupIdeas();
  const navigate = useNavigate();

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
        setLastAnalysis(assistantContent);
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

  const handleSaveIdea = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your startup idea.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Start a conversation first to validate an idea.",
        variant: "destructive",
      });
      return;
    }

    const firstUserMessage = userMessages[0].content;
    const title = firstUserMessage.slice(0, 100) + (firstUserMessage.length > 100 ? "..." : "");

    await saveIdea({
      title,
      description: firstUserMessage,
      ai_analysis: lastAnalysis || undefined,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for saved ideas */}
      {user && (
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-card border-r border-border/50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Saved Ideas</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SavedIdeas
                ideas={ideas}
                loading={ideasLoading}
                onDelete={deleteIdea}
              />
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">StartupGPT</h1>
                <p className="text-xs text-muted-foreground">Validate your startup ideas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveIdea}
                  className="hidden sm:flex"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Idea
                </Button>
              )}
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
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
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
                    <Zap className="w-10 h-10 text-primary" />
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

                {!user && (
                  <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="text-muted-foreground mb-3">
                      Sign in to save and manage your startup ideas
                    </p>
                    <Button onClick={() => navigate("/auth")}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                )}
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
              {messages.length > 0 && user && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveIdea}
                  className="sm:hidden h-12 w-12"
                >
                  <Save className="h-5 w-5" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              StartupGPT provides analysis based on market research. Always validate with real customers.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
