import { Lightbulb, FileSearch, BarChart3, AlertTriangle, ArrowRight, Star } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    icon: Lightbulb,
    title: "Idea",
    prompt: "Give me a one-line summary of my startup idea",
  },
  {
    icon: FileSearch,
    title: "Existing",
    prompt: "What already exists in this space?",
  },
  {
    icon: BarChart3,
    title: "Viability",
    prompt: "Is this idea viable? Give me a clear yes, maybe, or risky assessment",
  },
  {
    icon: AlertTriangle,
    title: "Risks",
    prompt: "What are the main risks for this startup idea?",
  },
  {
    icon: ArrowRight,
    title: "Next Steps",
    prompt: "What should be my next steps to move forward?",
  },
  {
    icon: Star,
    title: "Score",
    prompt: "Give me a score out of 10 for this startup idea",
  },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(suggestion.prompt)}
            className="group flex items-center gap-2 p-3 rounded-xl glass-panel hover:bg-secondary/50 transition-all duration-200 text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="w-4 h-4 text-primary" />
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
