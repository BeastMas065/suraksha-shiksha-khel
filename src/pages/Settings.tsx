import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  RefreshCw,
  Mail,
  Key,
  AlertTriangle,
  Volume2,
  Eye,
  Settings
} from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, getDisplayName } = useUserProfile();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateProfile({
        display_name: formData.display_name || null,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Button type="button" variant="outline" onClick={handlePasswordReset}>
                <Key className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Account Actions
          </CardTitle>
          <CardDescription>
            Manage your account settings and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={signOut}>
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useUserSettings();

  if (loading || !settings) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded"></div>
        <div className="h-32 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control how you receive notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive instant notifications for emergency alerts and updates
              </p>
            </div>
            <Switch
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => updateSettings({ notifications_enabled: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get safety alerts and important updates via email
              </p>
            </div>
            <Switch
              checked={settings.email_alerts}
              onCheckedChange={(checked) => updateSettings({ email_alerts: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications and game interactions
              </p>
            </div>
            <Switch
              checked={settings.sound_effects}
              onCheckedChange={(checked) => updateSettings({ sound_effects: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PrivacySettings: React.FC = () => {
  const { settings, updateSettings, loading } = useUserSettings();

  if (loading || !settings) {
    return <div className="h-32 bg-muted animate-pulse rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy preferences and data visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">Profile Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Control who can see your profile and activity
            </p>
            <Select
              value={settings.privacy_level}
              onValueChange={(value: 'public' | 'friends' | 'private') => 
                updateSettings({ privacy_level: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public - Everyone can see
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Private - Only you
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Auto-Save Progress</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your learning progress and game scores
              </p>
            </div>
            <Switch
              checked={settings.auto_save}
              onCheckedChange={(checked) => updateSettings({ auto_save: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useUserSettings();

  if (loading || !settings) {
    return <div className="h-32 bg-muted animate-pulse rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance & Language
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
            <Select
              value={settings.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => 
                updateSettings({ theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Language</Label>
            <p className="text-sm text-muted-foreground">
              Select your preferred language for the interface
            </p>
            <Select
              value={settings.language}
              onValueChange={(value: 'en' | 'hi') => 
                updateSettings({ language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsContent: React.FC = () => {
  const { resetToDefaults } = useUserSettings();
  const { toast } = useToast();

  const handleResetToDefaults = async () => {
    try {
      await resetToDefaults();
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and privacy settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reset Settings</CardTitle>
              <CardDescription>
                Reset all settings to their default values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all your preferences to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetToDefaults}>
                      Reset Settings
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  return (
    <Layout>
      <SettingsContent />
    </Layout>
  );
};