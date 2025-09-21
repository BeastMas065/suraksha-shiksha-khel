import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  video_id: string;
  duration: string;
  thumbnail_url?: string;
  category: string;
  views: number;
  is_active: boolean;
  order_index: number;
  hover_content?: string;
  created_at: string;
  updated_at: string;
}

interface VideoFormData {
  title: string;
  description: string;
  video_id: string;
  duration: string;
  thumbnail_url?: string;
  category: string;
  hover_content?: string;
  order_index: number;
}

export const useVideoManagement = () => {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('video_tutorials')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setVideos(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async (videoData: VideoFormData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('video_tutorials')
        .insert([{
          ...videoData,
          is_active: true,
          views: 0
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setVideos(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Video added successfully!",
      });

      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateVideo = async (id: string, videoData: Partial<VideoFormData>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('video_tutorials')
        .update(videoData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, ...data } : video
      ));

      toast({
        title: "Success",
        description: "Video updated successfully!",
      });

      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('video_tutorials')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setVideos(prev => prev.filter(video => video.id !== id));

      toast({
        title: "Success",
        description: "Video deleted successfully!",
      });

      return { error: null };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  const toggleVideoStatus = async (id: string, isActive: boolean) => {
    try {
      const { data, error: updateError } = await supabase
        .from('video_tutorials')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, is_active: isActive } : video
      ));

      toast({
        title: "Success",
        description: `Video ${isActive ? 'activated' : 'deactivated'} successfully!`,
      });

      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update video status. Please try again.",
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    toggleVideoStatus,
    refetchVideos: fetchVideos
  };
};