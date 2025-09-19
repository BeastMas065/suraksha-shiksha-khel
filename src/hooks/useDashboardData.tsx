import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProgress {
  current_xp: number;
  current_level: number;
  region: string | null;
  completed_modules: number;
  total_game_score: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  difficulty: string;
  hover_content: string | null;
  progress?: number;
  is_completed?: boolean;
}

interface SafetyGame {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  difficulty: string;
  hover_content: string | null;
  is_completed?: boolean;
}

interface SafetyAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  region: string | null;
  icon: string;
  created_at: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  video_id: string;
  duration: string;
  views: number;
  hover_content: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned_at?: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [safetyGames, setSafetyGames] = useState<SafetyGame[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      setUserProgress(progressData);

      // Fetch learning modules with user progress
      const { data: modulesData, error: modulesError } = await supabase
        .from('learning_modules')
        .select(`
          *,
          user_module_progress!inner(progress, is_completed)
        `)
        .eq('user_module_progress.user_id', user?.id)
        .eq('is_active', true)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Also fetch modules without progress
      const { data: allModulesData, error: allModulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (allModulesError) throw allModulesError;

      // Merge modules with progress data
      const modulesWithProgress = allModulesData?.map(module => {
        const progressEntry = modulesData?.find(m => m.id === module.id);
        return {
          ...module,
          progress: progressEntry?.user_module_progress?.[0]?.progress || 0,
          is_completed: progressEntry?.user_module_progress?.[0]?.is_completed || false
        };
      }) || [];

      setLearningModules(modulesWithProgress);

      // Fetch safety games with completion status
      const { data: gamesData, error: gamesError } = await supabase
        .from('safety_games')
        .select(`
          *,
          user_game_scores(is_completed)
        `)
        .eq('user_game_scores.user_id', user?.id)
        .eq('is_active', true)
        .order('order_index');

      if (gamesError) throw gamesError;

      // Also fetch all games
      const { data: allGamesData, error: allGamesError } = await supabase
        .from('safety_games')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (allGamesError) throw allGamesError;

      const gamesWithCompletion = allGamesData?.map(game => {
        const completionEntry = gamesData?.find(g => g.id === game.id);
        return {
          ...game,
          is_completed: completionEntry?.user_game_scores?.[0]?.is_completed || false
        };
      }) || [];

      setSafetyGames(gamesWithCompletion);

      // Fetch safety alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('safety_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (alertsError) throw alertsError;
      setSafetyAlerts(alertsData || []);

      // Fetch video tutorials
      const { data: videosData, error: videosError } = await supabase
        .from('video_tutorials')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
        .limit(6);

      if (videosError) throw videosError;
      setVideoTutorials(videosData || []);

      // Fetch user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievements(*)
        `)
        .eq('user_id', user?.id);

      if (achievementsError) throw achievementsError;

      const userAchievements = achievementsData?.map(ua => ({
        ...ua.achievements,
        earned_at: ua.earned_at
      })) || [];

      setAchievements(userAchievements);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateModuleProgress = async (moduleId: string, progress: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          progress,
          is_completed: progress >= 100,
          completed_at: progress >= 100 ? new Date().toISOString() : null
        });

      if (error) throw error;

      // Refresh data
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating module progress:', err);
    }
  };

  const completeGame = async (gameId: string, score: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_game_scores')
        .upsert({
          user_id: user.id,
          game_id: gameId,
          score,
          is_completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh data
      await fetchDashboardData();
    } catch (err) {
      console.error('Error completing game:', err);
    }
  };

  return {
    userProgress,
    learningModules,
    safetyGames,
    safetyAlerts,
    videoTutorials,
    achievements,
    loading,
    error,
    updateModuleProgress,
    completeGame,
    refetch: fetchDashboardData
  };
};