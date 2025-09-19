-- Create user_progress table for tracking user XP and levels
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  region TEXT,
  completed_modules INTEGER NOT NULL DEFAULT 0,
  total_game_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create learning_modules table
CREATE TABLE public.learning_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  content_url TEXT,
  hover_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_module_progress table
CREATE TABLE public.user_module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create safety_games table
CREATE TABLE public.safety_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 30,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  game_url TEXT,
  hover_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_game_scores table
CREATE TABLE public.user_game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.safety_games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safety_alerts table
CREATE TABLE public.safety_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  region TEXT,
  icon TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_tutorials table
CREATE TABLE public.video_tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_id TEXT NOT NULL,
  duration TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  hover_content TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('modules_completed', 'games_completed', 'total_xp', 'streak_days')),
  requirement_value INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE profiles.user_id = user_progress.user_id));

CREATE POLICY "Users can update their own progress" ON public.user_progress
FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE profiles.user_id = user_progress.user_id));

CREATE POLICY "Users can insert their own progress" ON public.user_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_modules (public read, admin write)
CREATE POLICY "Learning modules are viewable by everyone" ON public.learning_modules
FOR SELECT USING (is_active = true);

-- RLS Policies for user_module_progress
CREATE POLICY "Users can view their own module progress" ON public.user_module_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own module progress" ON public.user_module_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own module progress" ON public.user_module_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for safety_games (public read, admin write)
CREATE POLICY "Safety games are viewable by everyone" ON public.safety_games
FOR SELECT USING (is_active = true);

-- RLS Policies for user_game_scores
CREATE POLICY "Users can view their own game scores" ON public.user_game_scores
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game scores" ON public.user_game_scores
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game scores" ON public.user_game_scores
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for safety_alerts (public read)
CREATE POLICY "Safety alerts are viewable by everyone" ON public.safety_alerts
FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS Policies for video_tutorials (public read)
CREATE POLICY "Video tutorials are viewable by everyone" ON public.video_tutorials
FOR SELECT USING (is_active = true);

-- RLS Policies for achievements (public read)
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements
FOR SELECT USING (is_active = true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_module_progress_user_id ON public.user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module_id ON public.user_module_progress(module_id);
CREATE INDEX idx_user_game_scores_user_id ON public.user_game_scores(user_id);
CREATE INDEX idx_user_game_scores_game_id ON public.user_game_scores(game_id);
CREATE INDEX idx_safety_alerts_region ON public.safety_alerts(region);
CREATE INDEX idx_safety_alerts_severity ON public.safety_alerts(severity);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_learning_modules_order ON public.learning_modules(order_index);
CREATE INDEX idx_safety_games_order ON public.safety_games(order_index);
CREATE INDEX idx_video_tutorials_order ON public.video_tutorials(order_index);

-- Add triggers for timestamp updates
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_module_progress_updated_at
  BEFORE UPDATE ON public.user_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_games_updated_at
  BEFORE UPDATE ON public.safety_games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_game_scores_updated_at
  BEFORE UPDATE ON public.user_game_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_alerts_updated_at
  BEFORE UPDATE ON public.safety_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_tutorials_updated_at
  BEFORE UPDATE ON public.video_tutorials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize user progress when profile is created
CREATE OR REPLACE FUNCTION public.initialize_user_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, current_xp, current_level)
  VALUES (NEW.user_id, 0, 1);
  RETURN NEW;
END;
$$;

-- Create trigger to initialize user progress
CREATE TRIGGER on_profile_created_initialize_progress
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_progress();

-- Insert sample data for learning modules
INSERT INTO public.learning_modules (title, description, icon, xp_reward, difficulty, hover_content, order_index) VALUES
('Earthquake Preparedness', 'Learn essential earthquake safety measures and emergency protocols.', 'Activity', 100, 'Beginner', 'Comprehensive guide covering before, during, and after earthquake safety measures. Includes family emergency planning and supply kit preparation.', 1),
('Fire Safety Basics', 'Understanding fire prevention and evacuation procedures.', 'Flame', 80, 'Beginner', 'Essential fire safety knowledge including prevention, detection, and evacuation procedures for homes and workplaces.', 2),
('Flood Response', 'Critical steps for flood preparedness and response.', 'Waves', 120, 'Intermediate', 'Learn about flood risks, preparation strategies, and safe evacuation procedures during flood emergencies.', 3),
('First Aid Essentials', 'Basic first aid techniques for emergency situations.', 'Heart', 150, 'Advanced', 'Comprehensive first aid training covering CPR, wound care, and emergency medical response techniques.', 4);

-- Insert sample data for safety games
INSERT INTO public.safety_games (title, description, icon, xp_reward, difficulty, hover_content, order_index) VALUES
('Evacuation Route Quiz', 'Test your knowledge of safe evacuation procedures.', 'MapPin', 50, 'Easy', 'Interactive quiz testing knowledge of evacuation routes and emergency procedures in different scenarios.', 1),
('Emergency Kit Builder', 'Build the perfect emergency preparedness kit.', 'Package', 75, 'Medium', 'Hands-on activity to create comprehensive emergency kits for different disaster scenarios and family sizes.', 2),
('Disaster Response Simulator', 'Practice decision-making in crisis scenarios.', 'Zap', 100, 'Hard', 'Immersive simulation putting you in charge of disaster response decisions with real-time consequences.', 3);

-- Insert sample data for safety alerts
INSERT INTO public.safety_alerts (type, severity, message, icon, region) VALUES
('Weather Alert', 'medium', 'Heavy rainfall expected in your area. Stay updated and avoid low-lying areas.', 'CloudRain', 'Mumbai'),
('Traffic Advisory', 'low', 'Road closures due to ongoing construction work on Main Street.', 'Car', 'Delhi'),
('Emergency Drill', 'high', 'Earthquake drill scheduled for tomorrow at 2 PM. Participation is mandatory.', 'AlertTriangle', 'Bangalore');

-- Insert sample data for video tutorials
INSERT INTO public.video_tutorials (title, description, video_id, duration, views, hover_content, category, order_index) VALUES
('Home Safety Inspection', 'Complete guide to making your home disaster-ready', 'dQw4w9WgXcQ', '12:45', 15420, 'Step-by-step walkthrough of home safety inspection covering structural integrity, emergency supplies, and evacuation plans.', 'home-safety', 1),
('Emergency Communication', 'Setting up reliable communication during disasters', 'dQw4w9WgXcQ', '8:30', 9876, 'Learn about emergency communication methods, backup power solutions, and maintaining contact with family during disasters.', 'communication', 2),
('Community Response', 'How communities can work together in emergencies', 'dQw4w9WgXcQ', '15:20', 12304, 'Understanding community emergency response teams, neighborhood preparedness, and collective disaster response strategies.', 'community', 3);

-- Insert sample data for achievements
INSERT INTO public.achievements (title, description, icon, xp_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first learning module', 'Award', 50, 'modules_completed', 1),
('Knowledge Seeker', 'Complete 5 learning modules', 'BookOpen', 200, 'modules_completed', 5),
('Game Master', 'Complete 3 safety games', 'Trophy', 150, 'games_completed', 3),
('Expert Level', 'Reach 1000 XP', 'Star', 500, 'total_xp', 1000);