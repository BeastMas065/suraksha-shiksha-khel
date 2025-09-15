import React, { createContext, useContext, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  en: {
    appName: 'BugMint Suraksha',
    dashboard: 'Dashboard',
    learn: 'Learn',
    practice: 'Practice Drills',
    emergency: 'Emergency Contacts',
    games: 'Safety Games',
    admin: 'Admin Panel',
    profile: 'Profile',
    xp: 'XP',
    level: 'Level',
    selectLanguage: 'Select Language',
    totalXP: 'Total XP',
    currentLevel: 'Current Level',
    nextLevel: 'Next Level',
    progress: 'Progress',
    alerts: 'Emergency Alerts',
    settings: 'Settings',
    leaderboard: 'Leaderboard',
    achievements: 'Achievements',
  },
  hi: {
    appName: 'बगमिंट सुरक्षा',
    dashboard: 'डैशबोर्ड',
    learn: 'सीखें',
    practice: 'अभ्यास ड्रिल',
    emergency: 'आपातकालीन संपर्क',
    games: 'सुरक्षा खेल',
    admin: 'प्रशासन पैनल',
    profile: 'प्रोफ़ाइल',
    xp: 'अनुभव अंक',
    level: 'स्तर',
    selectLanguage: 'भाषा चुनें',
    totalXP: 'कुल अनुभव अंक',
    currentLevel: 'वर्तमान स्तर',
    nextLevel: 'अगला स्तर',
    progress: 'प्रगति',
    alerts: 'आपातकालीन चेतावनी',
    settings: 'सेटिंग्स',
    leaderboard: 'लीडरबोर्ड',
    achievements: 'उपलब्धियां',
  },
  te: {
    appName: 'బగ్‌మింట్ సురక్ష',
    dashboard: 'డాష్‌బోర్డ్',
    learn: 'నేర్చుకోండి',
    practice: 'అభ్యాస డ్రిల్స్',
    emergency: 'అత్యవసర పరిచయాలు',
    games: 'భద్రతా ఆటలు',
    admin: 'అడ్మిన్ ప్యానెల్',
    profile: 'ప్రొఫైల్',
    xp: 'అనుభవ పాయింట్లు',
    level: 'స్థాయి',
    selectLanguage: 'భాష ఎంచుకోండి',
    totalXP: 'మొత్తం అనుభవ పాయింట్లు',
    currentLevel: 'ప్రస్తుత స్థాయి',
    nextLevel: 'తదుపరి స్థాయి',
    progress: 'పురోగతి',
    alerts: 'అత్యవసర హెచ్చరికలు',
    settings: 'సెట్టింగులు',
    leaderboard: 'లీడర్‌బోర్డ్',
    achievements: 'విజయాలు',
  },
  ta: {
    appName: 'பக்மிண்ட் சுரக்ஷா',
    dashboard: 'டாஷ்போர்டு',
    learn: 'கற்றுக்கொள்ளுங்கள்',
    practice: 'பயிற்சி டிரில்கள்',
    emergency: 'அவசர தொடர்புகள்',
    games: 'பாதுகாப்பு விளையாட்டுகள்',
    admin: 'நிர்வாக பேனல்',
    profile: 'சுயவிவரம்',
    xp: 'அனுபவ புள்ளிகள்',
    level: 'நிலை',
    selectLanguage: 'மொழி தேர்ந்தெடுக்கவும்',
    totalXP: 'மொத்த அனுபவ புள்ளிகள்',
    currentLevel: 'தற்போதைய நிலை',
    nextLevel: 'அடுத்த நிலை',
    progress: 'முன்னேற்றம்',
    alerts: 'அவசர எச்சரிக்கைகள்',
    settings: 'அமைப்புகள்',
    leaderboard: 'லீடர்போர்டு',
    achievements: 'சாதனைகள்',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <Select value={currentLanguage} onValueChange={setLanguage}>
      <SelectTrigger className="w-44 bg-card shadow-card">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2">({lang.name})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};