import { cn } from "@/lib/utils";
import { Message } from "@/lib/chat";
import { Lightbulb, Sparkles } from "lucide-react";

// Helper to render inline bold/italic formatting
function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-primary font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

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
            // Headers with emoji support
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-base font-semibold mt-5 mb-2 text-primary border-b border-primary/20 pb-1">{line.slice(4)}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-lg font-bold mt-5 mb-3 text-primary">{line.slice(3)}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-xl font-bold mt-5 mb-3 text-primary">{line.slice(2)}</h1>;
            }
            
            // Bullet points with better styling
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={i} className="flex gap-3 my-2 pl-2">
                  <span className="text-primary mt-1.5 text-xs">●</span>
                  <span className="flex-1">{renderInlineFormatting(line.slice(2))}</span>
                </div>
              );
            }
            
            // Numbered lists with better styling
            if (line.match(/^\d+\.\s/)) {
              const match = line.match(/^(\d+)\.\s(.*)$/);
              if (match) {
                return (
                  <div key={i} className="flex gap-3 my-2 pl-2">
                    <span className="text-primary font-semibold min-w-[1.5rem]">{match[1]}.</span>
                    <span className="flex-1">{renderInlineFormatting(match[2])}</span>
                  </div>
                );
              }
            }
            
            // Bold text as sub-headers
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold text-primary mt-4 mb-2">{line.slice(2, -2)}</p>;
            }
            
            // Empty lines for spacing
            if (line.trim() === '') {
              return <div key={i} className="h-3" />;
            }
            
            // Regular paragraphs with inline formatting
            return <p key={i} className="my-1.5 leading-relaxed">{renderInlineFormatting(line)}</p>;
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