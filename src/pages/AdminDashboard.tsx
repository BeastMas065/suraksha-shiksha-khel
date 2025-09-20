import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageSelector';
import { useAdminData } from '@/hooks/useAdminData';
import AdminSettings from '@/components/AdminSettings';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Download,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3
} from 'lucide-react';

const AdminDashboardOverview: React.FC = () => {
  const { data, loading, error } = useAdminData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading dashboard data. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">School Administration Panel</h1>
            <p className="text-lg opacity-90">Monitor disaster preparedness training across schools</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Drill
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data.stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              {data.stats.activeUsers.toLocaleString()} active this month
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="bg-success text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-secondary" />
              Schools Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{data.stats.schoolsRegistered}</div>
            <div className="text-sm text-muted-foreground">Across multiple states</div>
            <div className="mt-2">
              <Badge variant="outline" className="bg-secondary text-white border-0">
                <MapPin className="h-3 w-3 mr-1" />
                Multi-state
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-warning" />
              Drills Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{data.stats.completedDrills.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">This academic year</div>
            <div className="mt-2">
              <Badge variant="outline" className="bg-warning text-white border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
              Average XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{data.stats.averageXP}</div>
            <div className="text-sm text-muted-foreground">Per student</div>
            <div className="mt-2">
              <Badge variant="outline" className="bg-accent text-white border-0">
                Level {Math.floor(data.stats.averageXP / 200) + 1}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      {data.regionalStats.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Regional Performance
            </CardTitle>
            <CardDescription>Training completion rates by state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.regionalStats.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{region.region}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {region.users.toLocaleString()} users
                      </span>
                      <Badge variant="outline" className={`${region.completion >= 80 ? 'bg-success' : region.completion >= 70 ? 'bg-warning' : 'bg-destructive'} text-white border-0`}>
                        {region.completion}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={region.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent School Activity */}
      {data.recentActivity.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent School Activity
            </CardTitle>
            <CardDescription>Latest drill completions and training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.school}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {activity.users} participants
                      </span>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`${activity.completion >= 85 ? 'bg-success' : activity.completion >= 70 ? 'bg-warning' : 'bg-destructive'} text-white border-0 mb-2`}>
                      {activity.completion}% Complete
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Drill completion rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Send Alert
            </CardTitle>
            <CardDescription>Broadcast emergency alerts to schools</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              Create Emergency Alert
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Schedule Training
            </CardTitle>
            <CardDescription>Plan upcoming disaster drills</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">
              Schedule New Drill
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-accent" />
              Generate Report
            </CardTitle>
            <CardDescription>Download detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboardContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminDashboardOverview />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <AdminDashboardContent />
    </Layout>
  );
};