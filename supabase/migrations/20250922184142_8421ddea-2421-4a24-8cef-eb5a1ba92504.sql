-- Create user_settings table for user preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  email_alerts BOOLEAN NOT NULL DEFAULT true,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  privacy_level TEXT NOT NULL DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
  auto_save BOOLEAN NOT NULL DEFAULT true,
  sound_effects BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_settings
FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for timestamp updates
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);