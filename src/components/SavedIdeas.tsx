import { useState } from 'react';
import { StartupIdea } from '@/hooks/useStartupIdeas';
import { Button } from '@/components/ui/button';
import { Lightbulb, Trash2, ChevronDown, ChevronUp, Calendar, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SavedIdeasProps {
  ideas: StartupIdea[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function SavedIdeas({ ideas, loading, onDelete }: SavedIdeasProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading your ideas...
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="p-8 text-center">
        <Lightbulb className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-muted-foreground">No saved ideas yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Start a conversation and save your validated ideas
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {ideas.map((idea) => (
        <div key={idea.id} className="p-4 hover:bg-secondary/30 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground line-clamp-1">
                  {idea.title}
                </span>
                {expandedId === idea.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(idea.created_at).toLocaleDateString()}
                </span>
                {idea.viability_score !== null && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {idea.viability_score}% viable
                  </span>
                )}
              </div>
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    startup idea and its analysis.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(idea.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {expandedId === idea.id && (
            <div className="mt-3 pl-6 space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground">{idea.description}</p>
              {idea.ai_analysis && (
                <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                  <p className="text-xs font-medium text-primary mb-1">AI Analysis</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                    {idea.ai_analysis}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
