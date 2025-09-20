import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  is_public: boolean;
}

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('admin_settings')
          .select('*')
          .order('setting_type', { ascending: true })
          .order('setting_key', { ascending: true });

        if (fetchError) throw fetchError;

        setSettings(data || []);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load admin settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const updateSetting = async (settingKey: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          setting_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

      setSettings(prev => 
        prev.map(setting => 
          setting.setting_key === settingKey 
            ? { ...setting, setting_value: newValue }
            : setting
        )
      );

      toast({
        title: "Success",
        description: "Setting updated successfully.",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to update setting: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { settings, loading, error, updateSetting };
};