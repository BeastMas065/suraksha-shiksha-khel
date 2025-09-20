import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { 
  Settings, 
  Bell, 
  Shield, 
  Zap,
  Save,
  AlertCircle
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, loading, error, updateSetting } = useAdminSettings();
  const [localChanges, setLocalChanges] = useState<Record<string, any>>({});

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'feature': return <Zap className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-primary';
      case 'notification': return 'bg-secondary';
      case 'security': return 'bg-destructive';
      case 'feature': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const handleLocalChange = (settingKey: string, value: any) => {
    setLocalChanges(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const handleSave = async (settingKey: string) => {
    if (localChanges[settingKey] !== undefined) {
      const success = await updateSetting(settingKey, localChanges[settingKey]);
      if (success) {
        setLocalChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[settingKey];
          return newChanges;
        });
      }
    }
  };

  const getCurrentValue = (setting: any) => {
    return localChanges[setting.setting_key] !== undefined 
      ? localChanges[setting.setting_key] 
      : setting.setting_value;
  };

  const hasUnsavedChanges = (settingKey: string) => {
    return localChanges[settingKey] !== undefined;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Error loading settings: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const settingsByType = settings.reduce((acc, setting) => {
    if (!acc[setting.setting_type]) {
      acc[setting.setting_type] = [];
    }
    acc[setting.setting_type].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  const renderSettingValue = (setting: any) => {
    const currentValue = getCurrentValue(setting);
    
    if (typeof currentValue === 'object' && currentValue !== null) {
      // Handle different object structures
      if (currentValue.enabled !== undefined) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${setting.setting_key}_enabled`}>Enabled</Label>
              <Switch
                id={`${setting.setting_key}_enabled`}
                checked={currentValue.enabled}
                onCheckedChange={(checked) => 
                  handleLocalChange(setting.setting_key, { ...currentValue, enabled: checked })
                }
              />
            </div>
            {currentValue.message && (
              <div className="space-y-2">
                <Label htmlFor={`${setting.setting_key}_message`}>Message</Label>
                <Input
                  id={`${setting.setting_key}_message`}
                  value={currentValue.message}
                  onChange={(e) => 
                    handleLocalChange(setting.setting_key, { ...currentValue, message: e.target.value })
                  }
                />
              </div>
            )}
            {currentValue.frequency && (
              <div className="space-y-2">
                <Label htmlFor={`${setting.setting_key}_frequency`}>Frequency</Label>
                <Input
                  id={`${setting.setting_key}_frequency`}
                  value={currentValue.frequency}
                  onChange={(e) => 
                    handleLocalChange(setting.setting_key, { ...currentValue, frequency: e.target.value })
                  }
                />
              </div>
            )}
            {currentValue.value !== undefined && (
              <div className="space-y-2">
                <Label htmlFor={`${setting.setting_key}_value`}>
                  Value {currentValue.unit && `(${currentValue.unit})`}
                </Label>
                <Input
                  id={`${setting.setting_key}_value`}
                  type="number"
                  value={currentValue.value}
                  onChange={(e) => 
                    handleLocalChange(setting.setting_key, { 
                      ...currentValue, 
                      value: parseInt(e.target.value) || 0 
                    })
                  }
                />
              </div>
            )}
            {currentValue.weather !== undefined && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${setting.setting_key}_weather`}>Weather Alerts</Label>
                  <Switch
                    id={`${setting.setting_key}_weather`}
                    checked={currentValue.weather}
                    onCheckedChange={(checked) => 
                      handleLocalChange(setting.setting_key, { ...currentValue, weather: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${setting.setting_key}_emergency`}>Emergency Alerts</Label>
                  <Switch
                    id={`${setting.setting_key}_emergency`}
                    checked={currentValue.emergency}
                    onCheckedChange={(checked) => 
                      handleLocalChange(setting.setting_key, { ...currentValue, emergency: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${setting.setting_key}_system`}>System Alerts</Label>
                  <Switch
                    id={`${setting.setting_key}_system`}
                    checked={currentValue.system}
                    onCheckedChange={(checked) => 
                      handleLocalChange(setting.setting_key, { ...currentValue, system: checked })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      } else if (currentValue.value !== undefined) {
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.setting_key}>Value</Label>
            <Input
              id={setting.setting_key}
              value={currentValue.value}
              onChange={(e) => 
                handleLocalChange(setting.setting_key, { ...currentValue, value: e.target.value })
              }
            />
          </div>
        );
      }
    }
    
    // Fallback for simple values
    return (
      <div className="space-y-2">
        <Label htmlFor={setting.setting_key}>Value</Label>
        <Input
          id={setting.setting_key}
          value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue)}
          onChange={(e) => handleLocalChange(setting.setting_key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>

      {Object.entries(settingsByType).map(([type, typeSettings]) => (
        <Card key={type} className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg capitalize">
              {getIcon(type)}
              {type} Settings
            </CardTitle>
            <CardDescription>
              Configure {type} related settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {typeSettings.map((setting, index) => (
              <div key={setting.setting_key}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h4>
                        <Badge variant="outline" className={`${getTypeColor(setting.setting_type)} text-white border-0`}>
                          {setting.setting_type}
                        </Badge>
                        {setting.is_public && (
                          <Badge variant="outline" className="bg-success text-white border-0">
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    {hasUnsavedChanges(setting.setting_key) && (
                      <Button
                        size="sm"
                        onClick={() => handleSave(setting.setting_key)}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                    )}
                  </div>
                  
                  {renderSettingValue(setting)}
                </div>
                
                {index < typeSettings.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminSettings;