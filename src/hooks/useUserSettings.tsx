import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_alerts: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  privacy_level: 'public' | 'friends' | 'private';
  auto_save: boolean;
  sound_effects: boolean;
  created_at: string;
  updated_at: string;
}

interface UserSettingsUpdate {
  notifications_enabled?: boolean;
  email_alerts?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'hi';
  privacy_level?: 'public' | 'friends' | 'private';
  auto_save?: boolean;
  sound_effects?: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let { data, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // If no settings exist, create default settings
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          notifications_enabled: true,
          email_alerts: true,
          theme: 'system' as const,
          language: 'en' as const,
          privacy_level: 'friends' as const,
          auto_save: true,
          sound_effects: true,
        };

        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (createError) throw createError;
        data = newSettings;
      }

      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: UserSettingsUpdate) => {
    if (!user || !settings) return;

    try {
      const { data, error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSettings(data);
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });

      return { data: null, error: errorMessage };
    }
  };

  const resetToDefaults = async () => {
    if (!user) return;

    const defaultSettings = {
      notifications_enabled: true,
      email_alerts: true,
      theme: 'system' as const,
      language: 'en' as const,
      privacy_level: 'friends' as const,
      auto_save: true,
      sound_effects: true,
    };

    return updateSettings(defaultSettings);
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetToDefaults,
    refetch: fetchSettings
  };
};