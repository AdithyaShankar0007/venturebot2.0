import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Json } from '@/integrations/supabase/types';

export interface StartupIdea {
  id: string;
  title: string;
  description: string;
  ai_analysis: string | null;
  viability_score: number | null;
  competitors: Json;
  created_at: string;
  updated_at: string;
}

export function useStartupIdeas() {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIdeas = async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('startup_ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedData: StartupIdea[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        ai_analysis: item.ai_analysis,
        viability_score: item.viability_score,
        competitors: item.competitors,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setIdeas(mappedData);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const saveIdea = async (idea: {
    title: string;
    description: string;
    ai_analysis?: string;
    viability_score?: number;
    competitors?: Json;
  }): Promise<StartupIdea | null> => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to save ideas.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('startup_ideas')
        .insert({
          user_id: user.id,
          title: idea.title,
          description: idea.description,
          ai_analysis: idea.ai_analysis || null,
          viability_score: idea.viability_score || null,
          competitors: idea.competitors || [],
        })
        .select()
        .single();

      if (error) throw error;

      const savedIdea: StartupIdea = {
        id: data.id,
        title: data.title,
        description: data.description,
        ai_analysis: data.ai_analysis,
        viability_score: data.viability_score,
        competitors: data.competitors,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setIdeas((prev) => [savedIdea, ...prev]);
      toast({
        title: 'Idea saved!',
        description: 'Your startup idea has been saved successfully.',
      });
      return savedIdea;
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: 'Failed to save',
        description: 'There was an error saving your idea. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('startup_ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
      toast({
        title: 'Idea deleted',
        description: 'Your startup idea has been removed.',
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: 'Failed to delete',
        description: 'There was an error deleting your idea. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    ideas,
    loading,
    saveIdea,
    deleteIdea,
    refetch: fetchIdeas,
  };
}
