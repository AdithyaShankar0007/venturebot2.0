import { cn } from "@/lib/utils";
import { Message } from "@/lib/chat";
import { Lightbulb, Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "glass-panel"
        )}
      >
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "prose-invert prose-p:text-foreground prose-headings:text-foreground prose-li:text-foreground prose-strong:text-primary"
        )}>
          {message.content.split('\n').map((line, i) => {
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(3)}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={i} className="flex gap-2 my-1">
                  <span className="text-primary">•</span>
                  <span>{line.slice(2)}</span>
                </div>
              );
            }
            if (line.match(/^\d+\.\s/)) {
              const match = line.match(/^(\d+)\.\s(.*)$/);
              if (match) {
                return (
                  <div key={i} className="flex gap-2 my-1">
                    <span className="text-primary font-medium">{match[1]}.</span>
                    <span>{match[2]}</span>
                  </div>
                );
              }
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold text-primary my-2">{line.slice(2, -2)}</p>;
            }
            if (line.trim() === '') {
              return <div key={i} className="h-2" />;
            }
            return <p key={i} className="my-1">{line}</p>;
          })}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse-subtle rounded-sm" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}