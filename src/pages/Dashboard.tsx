import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ModuleCard } from '@/components/ModuleCard';
import { XPDisplay } from '@/components/XPDisplay';
import { useLanguage } from '@/components/LanguageSelector';
import { 
  BookOpen, 
  Gamepad2, 
  Phone, 
  Users, 
  AlertTriangle, 
  Shield, 
  Flame, 
  CloudRain,
  Zap,
  Heart,
  MapPin,
  Globe,
  Cloud,
  Flag,
  Trophy,
  Target,
  Star
} from 'lucide-react';
import heroDisasterPrep from '@/assets/hero-disaster-prep.jpg';

const mockUserData = {
  name: 'राज पटेल',
  xp: 1250,
  level: 5,
  region: 'Gujarat',
  completedModules: 8,
  totalModules: 12,
};

const recentAlerts = [
  {
    id: 1,
    type: 'flood',
    severity: 'high',
    message: 'Heavy rainfall alert for Gujarat region. Practice evacuation routes.',
    timestamp: '2 hours ago',
    icon: CloudRain,
  },
  {
    id: 2,
    type: 'earthquake',
    severity: 'medium',
    message: 'Earthquake drill scheduled for schools in your area.',
    timestamp: '1 day ago',
    icon: Zap,
  },
];

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState(mockUserData.region);

  const learningModules = [
    {
      id: 1,
      title: 'Earthquake Safety',
      description: 'Learn Drop, Cover, and Hold techniques for earthquake preparedness',
      icon: Zap,
      progress: 80,
      xpReward: 100,
      difficulty: 'beginner' as const,
      hoverContent: 'Master the basics of earthquake safety including proper positioning during tremors and post-earthquake procedures.'
    },
    {
      id: 2,
      title: 'Fire Safety',
      description: 'Fire prevention, evacuation routes, and firefighting basics',
      icon: Flame,
      progress: 60,
      xpReward: 120,
      difficulty: 'intermediate' as const,
      hoverContent: 'Comprehensive fire safety training covering prevention, detection, and evacuation procedures for homes and schools.'
    },
    {
      id: 3,
      title: 'Flood Preparedness',
      description: 'Water safety, emergency supplies, and evacuation procedures',
      icon: CloudRain,
      progress: 0,
      xpReward: 150,
      difficulty: 'advanced' as const,
      hoverContent: 'Advanced flood preparedness including early warning systems, emergency kit preparation, and water safety techniques.'
    },
    {
      id: 4,
      title: 'First Aid Basics',
      description: 'Essential first aid skills for emergency situations',
      icon: Heart,
      progress: 100,
      xpReward: 80,
      difficulty: 'beginner' as const,
      isCompleted: true,
      hoverContent: 'Learn critical first aid skills including CPR, wound care, and emergency response protocols.'
    },
  ];

  const safetyGames = [
    {
      id: 1,
      title: 'Escape Room Challenge',
      description: 'Navigate through disaster scenarios in this interactive game',
      icon: Target,
      xpReward: 50,
      difficulty: 'intermediate' as const,
      hoverContent: 'Roblox-style escape room where players must solve puzzles and make quick decisions during emergencies.'
    },
    {
      id: 2,
      title: 'Safety Hero Quest',
      description: 'Role-play as a safety hero helping your community',
      icon: Shield,
      xpReward: 75,
      difficulty: 'beginner' as const,
      hoverContent: 'Adventure game where players become safety heroes, earning points by helping virtual community members during disasters.'
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Welcome Section with Hero Image */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full object-cover opacity-30 bg-cover bg-center transition-opacity duration-300"
          style={{ backgroundImage: `url(${heroDisasterPrep})` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">नमस्ते, {mockUserData.name}! 👋</h1>
            <p className="text-lg opacity-90">Ready to learn and stay safe today?</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{selectedRegion}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{mockUserData.completedModules}</div>
              <div className="text-sm opacity-80">Modules Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{mockUserData.level}</div>
              <div className="text-sm opacity-80">Safety Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Display and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <XPDisplay 
            currentXP={mockUserData.xp} 
            level={mockUserData.level}
            className="mb-6"
          />
        </div>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Drills Completed</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Games Played</span>
              <span className="font-semibold">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Safety Rank</span>
              <Badge variant="outline" className="bg-warning text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Gold
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('alerts')} - {selectedRegion}
          </CardTitle>
          <CardDescription>Stay updated with regional safety alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-destructive">
                <alert.icon className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>Safety Alert</span>
                  <Badge variant="outline" className={`${alert.severity === 'high' ? 'bg-destructive' : 'bg-warning'} text-white border-0`}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {alert.message}
                  <div className="text-xs text-muted-foreground mt-1">{alert.timestamp}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {t('learn')} Modules
          </h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningModules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              progress={module.progress}
              xpReward={module.xpReward}
              difficulty={module.difficulty}
              isCompleted={module.isCompleted}
              hoverContent={module.hoverContent}
              onClick={() => console.log(`Opening module: ${module.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Safety Games */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-secondary" />
            {t('games')}
          </h2>
          <Button variant="outline">Play More</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyGames.map((game) => (
            <ModuleCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              xpReward={game.xpReward}
              difficulty={game.difficulty}
              hoverContent={game.hoverContent}
              onClick={() => console.log(`Starting game: ${game.title}`)}
              className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30"
            />
          ))}
        </div>
      </div>

      {/* Emergency Contacts Quick Access */}
      <Card className="shadow-card bg-gradient-to-r from-destructive/10 to-warning/10 border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Emergency Contacts - {selectedRegion}
          </CardTitle>
          <CardDescription>Quick access to local emergency services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-background hover:bg-destructive hover:text-white">
              <Phone className="h-5 w-5" />
              <span className="text-sm">Police</span>
              <span className="text-xs">100</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-background hover:bg-destructive hover:text-white">
              <Flame className="h-5 w-5" />
              <span className="text-sm">Fire</span>
              <span className="text-xs">101</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-background hover:bg-destructive hover:text-white">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Medical</span>
              <span className="text-xs">108</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-background hover:bg-destructive hover:text-white">
              <Users className="h-5 w-5" />
              <span className="text-sm">Disaster</span>
              <span className="text-xs">1077</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disaster News & Awareness Sites */}
      <Card className="bg-card border-border hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe className="h-5 w-5 text-primary" />
            Disaster News & Awareness
          </CardTitle>
          <CardDescription>Stay updated with latest disaster news and awareness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://ndma.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">NDMA</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                National Disaster Management Authority - Official disaster management portal
              </p>
            </a>

            <a 
              href="https://imd.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">IMD</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                India Meteorological Department - Weather alerts and forecasts
              </p>
            </a>

            <a 
              href="https://www.india.gov.in/topics/disaster-management" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Flag className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">India.gov.in</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                Government of India - Disaster management resources and updates
              </p>
            </a>

            <a 
              href="https://reliefweb.int/country/ind" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">ReliefWeb</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                UN OCHA - Humanitarian news and disaster updates for India
              </p>
            </a>

            <a 
              href="https://www.redcross.org.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">Red Cross India</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                Indian Red Cross Society - Disaster relief and preparedness
              </p>
            </a>

            <a 
              href="https://www.who.int/emergencies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <h3 className="font-semibold text-foreground group-hover:text-accent-foreground">WHO Emergency</h3>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                World Health Organization - Health emergency and disaster info
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};