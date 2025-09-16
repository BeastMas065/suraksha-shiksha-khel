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
  Star,
  Youtube,
  Play
} from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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

  const youtubeVideos = [
    {
      id: 1,
      title: 'Earthquake Safety Training',
      description: 'Complete guide to Drop, Cover, and Hold technique',
      videoId: 'dQw4w9WgXcQ',
      duration: '12:45',
      views: '2.3M',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      hoverContent: 'Learn the essential earthquake safety protocols used by professionals worldwide. This comprehensive tutorial covers before, during, and after earthquake procedures.'
    },
    {
      id: 2,
      title: 'Fire Safety for Schools and Homes',
      description: 'Fire prevention and emergency evacuation procedures',
      videoId: 'dQw4w9WgXcQ',
      duration: '15:30',
      views: '1.8M',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      hoverContent: 'Comprehensive fire safety training covering prevention techniques, proper use of fire extinguishers, and evacuation planning for various environments.'
    },
    {
      id: 3,
      title: 'Flood Preparedness Guide',
      description: 'Water safety and emergency kit preparation',
      videoId: 'dQw4w9WgXcQ',
      duration: '18:20',
      views: '1.5M',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      hoverContent: 'Expert guidance on flood preparedness including early warning systems, creating emergency kits, and safe evacuation procedures during flood situations.'
    },
    {
      id: 4,
      title: 'First Aid Basics for Everyone',
      description: 'Essential first aid skills and CPR training',
      videoId: 'dQw4w9WgXcQ',
      duration: '22:15',
      views: '3.1M',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      hoverContent: 'Learn life-saving first aid techniques including CPR, wound care, and emergency response protocols that everyone should know.'
    }
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
            <HoverCard key={module.id}>
              <HoverCardTrigger asChild>
                <div>
                  <ModuleCard
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
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{module.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.hoverContent}
                    </p>
                    <div className="flex items-center pt-2">
                      <module.icon className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {module.xpReward} XP • {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
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
            <HoverCard key={game.id}>
              <HoverCardTrigger asChild>
                <div>
                  <ModuleCard
                    title={game.title}
                    description={game.description}
                    icon={game.icon}
                    xpReward={game.xpReward}
                    difficulty={game.difficulty}
                    hoverContent={game.hoverContent}
                    onClick={() => console.log(`Starting game: ${game.title}`)}
                    className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30"
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{game.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {game.hoverContent}
                    </p>
                    <div className="flex items-center pt-2">
                      <game.icon className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {game.xpReward} XP • {game.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>

      {/* YouTube Video Tutorials */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            Video Tutorials
          </h2>
          <Button variant="outline">View All Videos</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {youtubeVideos.map((video) => (
            <HoverCard key={video.id}>
              <HoverCardTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-red-500 to-red-600 rounded-t-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.views} views</span>
                      <div className="flex items-center gap-1">
                        <Youtube className="h-3 w-3" />
                        <span>Tutorial</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {video.hoverContent}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{video.views} views</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
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
            {[
              { icon: Phone, label: 'Police', number: '100' },
              { icon: Flame, label: 'Fire', number: '101' },
              { icon: Heart, label: 'Medical', number: '108' },
              { icon: Users, label: 'Disaster', number: '1077' }
            ].map((contact, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-background hover:bg-destructive hover:text-white transition-all duration-300">
                    <contact.icon className="h-5 w-5" />
                    <span className="text-sm">{contact.label}</span>
                    <span className="text-xs">{contact.number}</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <contact.icon className="h-4 w-4" />
                      {contact.label} Emergency
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Call {contact.number} for immediate {contact.label.toLowerCase()} assistance. Available 24/7 across India.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
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
            {[
              { 
                href: "https://ndma.gov.in", 
                icon: Shield, 
                title: "NDMA", 
                description: "National Disaster Management Authority - Official disaster management portal",
                hoverContent: "Access official guidelines, disaster preparedness plans, and real-time alerts from India's primary disaster management authority."
              },
              { 
                href: "https://imd.gov.in", 
                icon: Cloud, 
                title: "IMD", 
                description: "India Meteorological Department - Weather alerts and forecasts",
                hoverContent: "Get accurate weather forecasts, cyclone warnings, and meteorological data crucial for disaster preparedness."
              },
              { 
                href: "https://www.india.gov.in/topics/disaster-management", 
                icon: Flag, 
                title: "India.gov.in", 
                description: "Government of India - Disaster management resources and updates",
                hoverContent: "Comprehensive government resources including policies, schemes, and official communications on disaster management."
              },
              { 
                href: "https://reliefweb.int/country/ind", 
                icon: Globe, 
                title: "ReliefWeb", 
                description: "UN OCHA - Humanitarian news and disaster updates for India",
                hoverContent: "International perspective on disaster relief efforts, humanitarian news, and coordination of global assistance for India."
              },
              { 
                href: "https://www.redcross.org.in", 
                icon: Heart, 
                title: "Red Cross India", 
                description: "Indian Red Cross Society - Disaster relief and preparedness",
                hoverContent: "Learn about volunteer opportunities, first aid training, and community-based disaster preparedness programs."
              },
              { 
                href: "https://www.who.int/emergencies", 
                icon: AlertTriangle, 
                title: "WHO Emergency", 
                description: "World Health Organization - Health emergency and disaster info",
                hoverContent: "Global health emergency guidelines, disease outbreak information, and health-related disaster preparedness resources."
              }
            ].map((site, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <a 
                    href={site.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg border border-border bg-background hover:bg-accent hover:shadow-lg transition-all duration-300 hover:scale-105 group block"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <site.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      <h3 className="font-semibold text-foreground group-hover:text-accent-foreground transition-colors">{site.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors">
                      {site.description}
                    </p>
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <site.icon className="h-4 w-4" />
                      {site.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {site.hoverContent}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};