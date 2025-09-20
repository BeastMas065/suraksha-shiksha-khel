-- Create admin_users table for admin role management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  admin_level TEXT NOT NULL DEFAULT 'admin' CHECK (admin_level IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB NOT NULL DEFAULT '{"view_dashboard": true, "manage_alerts": false, "manage_users": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create schools table for school management
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  total_students INTEGER NOT NULL DEFAULT 0,
  total_teachers INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create school_users table to link users to schools
CREATE TABLE public.school_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, school_id)
);

-- Create disaster_drills table for scheduled drills
CREATE TABLE public.disaster_drills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  drill_type TEXT NOT NULL CHECK (drill_type IN ('earthquake', 'fire', 'flood', 'general')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  region TEXT, -- If NULL, applies to all regions
  state TEXT, -- If NULL, applies to all states
  created_by UUID NOT NULL REFERENCES public.profiles(user_id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  participants_count INTEGER NOT NULL DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drill_participants table for tracking participation
CREATE TABLE public.drill_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drill_id UUID NOT NULL REFERENCES public.disaster_drills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  participated BOOLEAN NOT NULL DEFAULT false,
  participation_score INTEGER DEFAULT NULL CHECK (participation_score >= 0 AND participation_score <= 100),
  feedback TEXT,
  participated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(drill_id, user_id)
);

-- Create admin_settings table for system configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('system', 'notification', 'security', 'feature')),
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table for tracking admin actions
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check admin privileges
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = user_uuid
    AND admin_level IN ('super_admin', 'admin')
  )
$$;

-- Create function to check super admin privileges
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = user_uuid
    AND admin_level = 'super_admin'
  )
$$;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS Policies for schools
CREATE POLICY "Everyone can view active schools" ON public.schools
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage schools" ON public.schools
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for school_users
CREATE POLICY "Users can view their school associations" ON public.school_users
FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage school users" ON public.school_users
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for disaster_drills
CREATE POLICY "Everyone can view active drills" ON public.disaster_drills
FOR SELECT USING (status IN ('scheduled', 'active'));

CREATE POLICY "Admins can manage drills" ON public.disaster_drills
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for drill_participants
CREATE POLICY "Users can view their drill participation" ON public.drill_participants
FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their participation" ON public.drill_participants
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert participation records" ON public.drill_participants
FOR INSERT WITH CHECK (true);

-- RLS Policies for admin_settings
CREATE POLICY "Everyone can view public settings" ON public.admin_settings
FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.admin_settings
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage settings" ON public.admin_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_level ON public.admin_users(admin_level);
CREATE INDEX idx_schools_region ON public.schools(region);
CREATE INDEX idx_schools_state ON public.schools(state);
CREATE INDEX idx_schools_active ON public.schools(is_active);
CREATE INDEX idx_school_users_user_id ON public.school_users(user_id);
CREATE INDEX idx_school_users_school_id ON public.school_users(school_id);
CREATE INDEX idx_disaster_drills_status ON public.disaster_drills(status);
CREATE INDEX idx_disaster_drills_date ON public.disaster_drills(scheduled_date);
CREATE INDEX idx_disaster_drills_school ON public.disaster_drills(school_id);
CREATE INDEX idx_drill_participants_drill_id ON public.drill_participants(drill_id);
CREATE INDEX idx_drill_participants_user_id ON public.drill_participants(user_id);
CREATE INDEX idx_admin_settings_key ON public.admin_settings(setting_key);
CREATE INDEX idx_admin_settings_type ON public.admin_settings(setting_type);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Add triggers for timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disaster_drills_updated_at
  BEFORE UPDATE ON public.disaster_drills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample schools data
INSERT INTO public.schools (name, code, region, state, district, total_students, total_teachers) VALUES
('Gujarat Primary School', 'GPS001', 'Western', 'Gujarat', 'Ahmedabad', 245, 18),
('Shri Ram Secondary School', 'SRS002', 'Western', 'Maharashtra', 'Mumbai', 620, 35),
('Saraswati Higher Secondary School', 'SHSS003', 'Western', 'Rajasthan', 'Jaipur', 380, 28),
('Model Public School', 'MPS004', 'Central', 'Madhya Pradesh', 'Bhopal', 445, 32);

-- Insert sample admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, setting_type, description, is_public, updated_by) VALUES
('app_name', '{"value": "BugMint Disaster Preparedness"}', 'system', 'Application name displayed in UI', true, (SELECT user_id FROM public.profiles LIMIT 1)),
('maintenance_mode', '{"enabled": false, "message": "System under maintenance"}', 'system', 'Maintenance mode configuration', false, (SELECT user_id FROM public.profiles LIMIT 1)),
('max_drill_duration', '{"value": 120, "unit": "minutes"}', 'system', 'Maximum allowed drill duration', false, (SELECT user_id FROM public.profiles LIMIT 1)),
('notification_email', '{"enabled": true, "frequency": "daily"}', 'notification', 'Email notification settings', false, (SELECT user_id FROM public.profiles LIMIT 1)),
('auto_alerts', '{"weather": true, "emergency": true, "system": false}', 'feature', 'Automatic alert generation settings', false, (SELECT user_id FROM public.profiles LIMIT 1));

-- Insert sample disaster drills
INSERT INTO public.disaster_drills (title, description, drill_type, scheduled_date, school_id, created_by, status, participants_count, completion_rate) VALUES
('Monthly Fire Safety Drill', 'Routine fire evacuation drill for all students', 'fire', '2024-02-15 10:00:00+00', (SELECT id FROM public.schools WHERE code = 'GPS001'), (SELECT user_id FROM public.profiles LIMIT 1), 'completed', 245, 92.5),
('Earthquake Response Training', 'Drop, cover, and hold earthquake drill', 'earthquake', '2024-02-20 14:30:00+00', (SELECT id FROM public.schools WHERE code = 'SRS002'), (SELECT user_id FROM public.profiles LIMIT 1), 'completed', 620, 85.4),
('Emergency Evacuation Drill', 'General emergency evacuation procedures', 'general', '2024-03-01 09:00:00+00', NULL, (SELECT user_id FROM public.profiles LIMIT 1), 'scheduled', 0, 0.00);