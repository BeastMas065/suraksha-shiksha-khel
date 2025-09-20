import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  schoolsRegistered: number;
  completedDrills: number;
  averageXP: number;
}

interface RegionalStats {
  region: string;
  users: number;
  completion: number;
}

interface SchoolActivity {
  school: string;
  users: number;
  completion: number;
  date: string;
}

interface AdminData {
  stats: AdminStats;
  regionalStats: RegionalStats[];
  recentActivity: SchoolActivity[];
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic stats
        const [
          { count: totalUsers },
          { count: schoolsCount },
          { data: avgXPData }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('schools').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('user_progress').select('current_xp')
        ]);

        // Calculate active users (users with progress in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUsers } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', thirtyDaysAgo.toISOString());

        // Get completed drills count
        const { count: completedDrills } = await supabase
          .from('disaster_drills')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        // Calculate average XP
        const averageXP = avgXPData && avgXPData.length > 0
          ? Math.round(avgXPData.reduce((sum, user) => sum + (user.current_xp || 0), 0) / avgXPData.length)
          : 0;

        // Fetch regional stats
        const { data: schools } = await supabase
          .from('schools')
          .select(`
            state,
            total_students
          `)
          .eq('is_active', true);

        // Fetch drill completion rates
        const { data: drillStats } = await supabase
          .from('disaster_drills')
          .select('completion_rate, schools!inner(state)')
          .eq('status', 'completed');

        const regionalStats: RegionalStats[] = [];
        const regionMap = new Map<string, { users: number; completions: number[]; }>();

        schools?.forEach(school => {
          const region = school.state;
          if (!regionMap.has(region)) {
            regionMap.set(region, { users: 0, completions: [] });
          }
          const regionData = regionMap.get(region)!;
          regionData.users += school.total_students || 0;
        });

        // Add completion rates from drills
        drillStats?.forEach((drill: any) => {
          const state = drill.schools?.state;
          if (state && regionMap.has(state) && drill.completion_rate) {
            regionMap.get(state)!.completions.push(drill.completion_rate);
          }
        });

        regionMap.forEach((data, region) => {
          const avgCompletion = data.completions.length > 0
            ? Math.round(data.completions.reduce((sum, rate) => sum + rate, 0) / data.completions.length)
            : 0;
          
          regionalStats.push({
            region,
            users: data.users,
            completion: avgCompletion
          });
        });

        // Fetch recent school activity
        const { data: recentDrills } = await supabase
          .from('disaster_drills')
          .select(`
            *,
            schools (
              name,
              total_students
            )
          `)
          .eq('status', 'completed')
          .order('updated_at', { ascending: false })
          .limit(5);

        const recentActivity: SchoolActivity[] = recentDrills?.map(drill => ({
          school: drill.schools?.name || 'All Schools',
          users: drill.participants_count || drill.schools?.total_students || 0,
          completion: Math.round(drill.completion_rate || 0),
          date: new Date(drill.updated_at).toLocaleDateString()
        })) || [];

        setData({
          stats: {
            totalUsers: totalUsers || 0,
            activeUsers: activeUsers || 0,
            schoolsRegistered: schoolsCount || 0,
            completedDrills: completedDrills || 0,
            averageXP
          },
          regionalStats,
          recentActivity
        });

      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load admin data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [toast]);

  return { data, loading, error };
};