import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useVideoManagement } from '@/hooks/useVideoManagement';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Youtube, 
  Clock, 
  Eye,
  ExternalLink
} from 'lucide-react';

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

const VideoForm: React.FC<{
  initialData?: Partial<VideoFormData>;
  onSubmit: (data: VideoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    video_id: initialData?.video_id || '',
    duration: initialData?.duration || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    category: initialData?.category || 'general',
    hover_content: initialData?.hover_content || '',
    order_index: initialData?.order_index || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter video title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="video_id">YouTube Video ID</Label>
          <Input
            id="video_id"
            value={formData.video_id}
            onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
            placeholder="e.g., dQw4w9WgXcQ"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter video description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="e.g., 5:23"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="earthquake">Earthquake</SelectItem>
              <SelectItem value="fire">Fire Safety</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="first-aid">First Aid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_index">Order Index</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
          placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hover_content">Hover Content (optional)</Label>
        <Textarea
          id="hover_content"
          value={formData.hover_content}
          onChange={(e) => setFormData(prev => ({ ...prev, hover_content: e.target.value }))}
          placeholder="Additional details shown on hover"
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Video'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export const VideoManagement: React.FC = () => {
  const { videos, loading, addVideo, updateVideo, deleteVideo, toggleVideoStatus } = useVideoManagement();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVideo = async (data: VideoFormData) => {
    setIsSubmitting(true);
    const { error } = await addVideo(data);
    setIsSubmitting(false);
    
    if (!error) {
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateVideo = async (data: VideoFormData) => {
    if (!editingVideo) return;
    
    setIsSubmitting(true);
    const { error } = await updateVideo(editingVideo.id, data);
    setIsSubmitting(false);
    
    if (!error) {
      setEditingVideo(null);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Video Management</h2>
          <p className="text-muted-foreground">Manage educational video tutorials</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a new educational video tutorial to the platform
              </DialogDescription>
            </DialogHeader>
            <VideoForm
              onSubmit={handleAddVideo}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold">{videos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Videos</p>
                <p className="text-2xl font-bold">{videos.filter(v => v.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{new Set(videos.map(v => v.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative">
              <Youtube className="h-12 w-12 text-white" />
              <div className="absolute top-2 right-2">
                <Switch
                  checked={video.is_active}
                  onCheckedChange={(checked) => toggleVideoStatus(video.id, checked)}
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm line-clamp-2 flex-1">{video.title}</h3>
                <Badge variant="outline" className="ml-2 text-xs">
                  {video.category}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{video.views.toLocaleString()} views</span>
                <span>Order: {video.order_index}</span>
              </div>
              
              <Separator className="mb-3" />
              
              <div className="flex gap-2">
                <Dialog open={editingVideo?.id === video.id} onOpenChange={(open) => !open && setEditingVideo(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setEditingVideo(video)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Video</DialogTitle>
                      <DialogDescription>
                        Update video tutorial information
                      </DialogDescription>
                    </DialogHeader>
                    <VideoForm
                      initialData={editingVideo}
                      onSubmit={handleUpdateVideo}
                      onCancel={() => setEditingVideo(null)}
                      isLoading={isSubmitting}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteVideo(video.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first educational video tutorial.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Video
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};