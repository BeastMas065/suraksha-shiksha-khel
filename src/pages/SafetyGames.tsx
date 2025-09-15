import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageSelector';
import { 
  Gamepad2, 
  Star, 
  Trophy, 
  Target, 
  Shield, 
  Play,
  Users,
  Clock,
  Zap,
  Heart,
  Award,
  Lock,
  CheckCircle
} from 'lucide-react';
import safetyGamesHero from '@/assets/safety-games-hero.jpg';

const safetyGames = [
  {
    id: 1,
    title: 'Earthquake Escape Room',
    description: 'Navigate through a virtual school during an earthquake. Make quick decisions to stay safe!',
    icon: Zap,
    difficulty: 'beginner',
    duration: '10-15 mins',
    xpReward: 150,
    players: 1248,
    rating: 4.8,
    isLocked: false,
    gameType: 'escape',
    preview: 'Practice Drop, Cover, and Hold in a 3D school environment',
    achievements: ['First Escape', 'Perfect Safety', 'Speed Runner']
  },
  {
    id: 2,
    title: 'Fire Safety Hero',
    description: 'Help rescue people from a burning building while following safety protocols.',
    icon: Shield,
    difficulty: 'intermediate',
    duration: '15-20 mins',
    xpReward: 200,
    players: 892,
    rating: 4.9,
    isLocked: false,
    gameType: 'action',
    preview: 'Learn evacuation routes and fire safety procedures through gameplay',
    achievements: ['Life Saver', 'Fire Marshal', 'Hero of the Day']
  },
  {
    id: 3,
    title: 'Flood Rescue Mission',
    description: 'Coordinate rescue operations during a flood emergency in rural areas.',
    icon: Heart,
    difficulty: 'advanced',
    duration: '20-25 mins',
    xpReward: 250,
    players: 567,
    rating: 4.7,
    isLocked: true,
    gameType: 'strategy',
    preview: 'Advanced flood response and community coordination',
    achievements: ['Flood Warrior', 'Community Leader', 'Rescue Expert']
  },
  {
    id: 4,
    title: 'Safety Quiz Challenge',
    description: 'Test your disaster preparedness knowledge in this fun multiplayer quiz!',
    icon: Target,
    difficulty: 'beginner',
    duration: '5-10 mins',
    xpReward: 100,
    players: 2156,
    rating: 4.6,
    isLocked: false,
    gameType: 'quiz',
    preview: 'Quick-fire questions on disaster safety with friends',
    achievements: ['Quiz Master', 'Know-It-All', 'Speed Thinker']
  },
  {
    id: 5,
    title: 'Disaster Preparedness Tycoon',
    description: 'Build and manage a disaster-ready community. Plan, prepare, and protect!',
    icon: Trophy,
    difficulty: 'intermediate',
    duration: '30+ mins',
    xpReward: 300,
    players: 434,
    rating: 4.9,
    isLocked: true,
    gameType: 'simulation',
    preview: 'City-building game focused on disaster preparedness',
    achievements: ['City Planner', 'Disaster Master', 'Community Builder']
  },
  {
    id: 6,
    title: 'Virtual Reality Drill',
    description: 'Experience realistic disaster scenarios in immersive VR environment.',
    icon: Gamepad2,
    difficulty: 'advanced',
    duration: '15-30 mins',
    xpReward: 400,
    players: 123,
    rating: 5.0,
    isLocked: true,
    gameType: 'vr',
    preview: 'Cutting-edge VR training for advanced users',
    achievements: ['VR Pioneer', 'Reality Master', 'Future Ready']
  }
];

const SafetyGamesContent: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'escape': return Zap;
      case 'action': return Shield;
      case 'strategy': return Users;
      case 'quiz': return Target;
      case 'simulation': return Trophy;
      case 'vr': return Gamepad2;
      default: return Play;
    }
  };

  const filteredGames = safetyGames.filter(game => 
    selectedDifficulty === 'all' || game.difficulty === selectedDifficulty
  );

  const startGame = (game: any) => {
    if (game.isLocked) {
      alert('Complete more basic drills to unlock this game!');
      return;
    }
    // In a real app, this would launch the game
    alert(`Starting ${game.title}! Get ready to learn and have fun!`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header with Hero Image */}
      <div className="bg-gradient-success rounded-2xl p-6 text-white relative overflow-hidden">
        <img 
          src={safetyGamesHero} 
          alt="Children playing safety games" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Gamepad2 className="h-8 w-8" />
              Safety Games Arena
            </h1>
            <p className="text-lg opacity-90">Learn disaster preparedness through fun, interactive games!</p>
          </div>
          <div className="mt-4 md:mt-0 space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Games Played: 47</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">High Score: 2,480 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(difficulty)}
            className="whitespace-nowrap"
          >
            {difficulty === 'all' ? 'All Games' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Button>
        ))}
      </div>

      {/* Achievement Showcase */}
      <Card className="shadow-card bg-gradient-to-r from-warning/10 to-accent/10 border-warning/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Badge variant="outline" className="bg-warning text-white border-0 px-3 py-2 whitespace-nowrap">
              🏆 Quiz Master
            </Badge>
            <Badge variant="outline" className="bg-success text-white border-0 px-3 py-2 whitespace-nowrap">
              🛡️ Safety Hero
            </Badge>
            <Badge variant="outline" className="bg-primary text-white border-0 px-3 py-2 whitespace-nowrap">
              ⚡ Speed Runner
            </Badge>
            <Badge variant="outline" className="bg-accent text-white border-0 px-3 py-2 whitespace-nowrap">
              🎯 Perfect Score
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const GameIcon = getGameTypeIcon(game.gameType);
          
          return (
            <Card 
              key={game.id} 
              className={`shadow-card hover:shadow-hover transition-all duration-200 ${
                game.isLocked ? 'opacity-70' : 'hover:scale-105 cursor-pointer'
              } ${game.gameType === 'vr' ? 'bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30' : ''}`}
              onClick={() => startGame(game)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${game.isLocked ? 'bg-muted' : getDifficultyColor(game.difficulty)}/20`}>
                      {game.isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <GameIcon className={`h-5 w-5 ${getDifficultyColor(game.difficulty).replace('bg-', 'text-')}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{game.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`${getDifficultyColor(game.difficulty)} text-white border-0 text-xs`}>
                          {game.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-current text-warning" />
                          {game.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed mb-4">
                  {game.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    {game.preview}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {game.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {game.players.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      <Star className="h-3 w-3 mr-1" />
                      {game.xpReward} XP
                    </Badge>
                    {game.achievements.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {game.achievements.length} achievements
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full ${game.isLocked ? 'opacity-50' : ''}`}
                    disabled={game.isLocked}
                    variant={game.isLocked ? "secondary" : "default"}
                  >
                    {game.isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard Teaser */}
      <Card className="shadow-card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Weekly Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'अनिल शर्मा', xp: 2480, rank: 1 },
              { name: 'प्रिया पटेल', xp: 2350, rank: 2 },
              { name: 'राहुल कुमार', xp: 2120, rank: 3 }
            ].map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${player.rank === 1 ? 'bg-warning' : player.rank === 2 ? 'bg-muted' : 'bg-accent'} text-white border-0 w-8 h-8 p-0 flex items-center justify-center`}>
                    {player.rank}
                  </Badge>
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{player.xp.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">XP this week</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const SafetyGames: React.FC = () => {
  return (
    <Layout>
      <SafetyGamesContent />
    </Layout>
  );
};