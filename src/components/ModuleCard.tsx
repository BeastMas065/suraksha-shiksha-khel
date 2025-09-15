import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { LucideIcon, Play, Lock, CheckCircle, Star } from 'lucide-react';

type ModuleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  progress?: number;
  xpReward?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isLocked?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  hoverContent?: string;
  className?: string;
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  progress = 0,
  xpReward = 0,
  difficulty = 'beginner',
  isLocked = false,
  isCompleted = false,
  onClick,
  hoverContent,
  className = '',
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-success';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getCardStyle = () => {
    if (isLocked) return 'opacity-60 cursor-not-allowed';
    if (isCompleted) return 'bg-gradient-success border-success/30';
    return 'hover:shadow-hover transition-all duration-200 cursor-pointer hover:scale-105';
  };

  const cardContent = (
    <Card className={`${getCardStyle()} ${className} group`} onClick={!isLocked ? onClick : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/20' : 'bg-primary/20'} transition-colors`}>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : isLocked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Icon className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getDifficultyColor(difficulty)} text-white border-0 text-xs`}>
                  {difficulty}
                </Badge>
                {xpReward > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {xpReward} XP
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed mb-4">
          {description}
        </CardDescription>
        
        {progress > 0 && !isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <Button 
          variant={isCompleted ? "secondary" : "default"} 
          className="w-full"
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  if (hoverContent) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {cardContent}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{hoverContent}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return cardContent;
};