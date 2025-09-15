import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Zap } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

type XPDisplayProps = {
  currentXP: number;
  level: number;
  className?: string;
};

export const XPDisplay: React.FC<XPDisplayProps> = ({ currentXP, level, className = '' }) => {
  const { t } = useLanguage();
  
  const xpForLevel = (lvl: number) => lvl * 100;
  const xpForCurrentLevel = xpForLevel(level);
  const xpForNextLevel = xpForLevel(level + 1);
  const progressToNextLevel = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Trophy className="h-4 w-4" />;
    if (level >= 5) return <Star className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-gradient-accent';
    if (level >= 5) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className={`bg-card rounded-xl p-4 shadow-card transition-colors duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getLevelColor(level)} text-white border-0`}>
            {getLevelIcon(level)}
            <span className="ml-1">{t('level')} {level}</span>
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{currentXP.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{t('totalXP')}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('progress')}</span>
          <span className="font-medium">
            {currentXP - xpForCurrentLevel} / {xpForNextLevel - xpForCurrentLevel} XP
          </span>
        </div>
        <Progress 
          value={Math.min(progressToNextLevel, 100)} 
          className="h-3 bg-muted"
        />
        <div className="text-xs text-muted-foreground text-center">
          {Math.max(0, xpForNextLevel - currentXP)} XP {t('nextLevel').toLowerCase()}
        </div>
      </div>
    </div>
  );
};