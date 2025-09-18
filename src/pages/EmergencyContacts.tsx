import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageSelector';
import { 
  Phone, 
  MapPin, 
  Search, 
  Filter,
  Flame,
  Heart,
  Shield,
  Users,
  Zap,
  Building,
  Truck,
  AlertTriangle
} from 'lucide-react';
import emergencyHero from '@/assets/hero-disaster-prep.jpeg';

const emergencyContacts = {
  'Gujarat': [
    { id: 1, name: 'Gujarat Police Control Room', number: '100', type: 'police', icon: Shield, available: '24/7' },
    { id: 2, name: 'Fire Emergency Services', number: '101', type: 'fire', icon: Flame, available: '24/7' },
    { id: 3, name: 'Medical Emergency', number: '108', type: 'medical', icon: Heart, available: '24/7' },
    { id: 4, name: 'Disaster Management Cell', number: '1077', type: 'disaster', icon: AlertTriangle, available: '24/7' },
    { id: 5, name: 'Gujarat Emergency Services', number: '079-23251900', type: 'emergency', icon: Users, available: '24/7' },
    { id: 6, name: 'Ahmedabad Fire Station', number: '079-25506464', type: 'fire', icon: Flame, available: '24/7' },
    { id: 7, name: 'Civil Hospital Ahmedabad', number: '079-22682671', type: 'medical', icon: Heart, available: '24/7' },
    { id: 8, name: 'Traffic Police Helpline', number: '103', type: 'police', icon: Shield, available: '24/7' },
  ],
  'Maharashtra': [
    { id: 1, name: 'Maharashtra Police', number: '100', type: 'police', icon: Shield, available: '24/7' },
    { id: 2, name: 'Mumbai Fire Brigade', number: '101', type: 'fire', icon: Flame, available: '24/7' },
    { id: 3, name: 'Medical Emergency', number: '108', type: 'medical', icon: Heart, available: '24/7' },
    { id: 4, name: 'Disaster Management', number: '022-22027990', type: 'disaster', icon: AlertTriangle, available: '24/7' },
    { id: 5, name: 'Mumbai Police Control', number: '022-22621855', type: 'police', icon: Shield, available: '24/7' },
  ],
  'Rajasthan': [
    { id: 1, name: 'Rajasthan Police', number: '100', type: 'police', icon: Shield, available: '24/7' },
    { id: 2, name: 'Fire Services', number: '101', type: 'fire', icon: Flame, available: '24/7' },
    { id: 3, name: 'Medical Emergency', number: '108', type: 'medical', icon: Heart, available: '24/7' },
    { id: 4, name: 'State Emergency Response', number: '0141-2921111', type: 'disaster', icon: AlertTriangle, available: '24/7' },
  ],
  'Tamil Nadu': [
    { id: 1, name: 'Tamil Nadu Police', number: '100', type: 'police', icon: Shield, available: '24/7' },
    { id: 2, name: 'Fire & Rescue Services', number: '101', type: 'fire', icon: Flame, available: '24/7' },
    { id: 3, name: 'Medical Emergency', number: '108', type: 'medical', icon: Heart, available: '24/7' },
    { id: 4, name: 'Chennai Disaster Management', number: '044-25619492', type: 'disaster', icon: AlertTriangle, available: '24/7' },
  ],
};

const contactTypes = [
  { value: 'all', label: 'All Services', icon: Users },
  { value: 'police', label: 'Police', icon: Shield },
  { value: 'fire', label: 'Fire Services', icon: Flame },
  { value: 'medical', label: 'Medical', icon: Heart },
  { value: 'disaster', label: 'Disaster Management', icon: AlertTriangle },
];

const EmergencyContactsContent: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('Gujarat');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'police': return 'bg-primary';
      case 'fire': return 'bg-destructive';
      case 'medical': return 'bg-success';
      case 'disaster': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const filteredContacts = emergencyContacts[selectedRegion as keyof typeof emergencyContacts]?.filter(contact => {
    const matchesType = selectedType === 'all' || contact.type === selectedType;
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.number.includes(searchQuery);
    return matchesType && matchesSearch;
  }) || [];

  const callContact = (number: string, name: string) => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${name} at ${number}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header with Hero Image */}
      <div className="bg-gradient-to-r from-destructive to-warning rounded-2xl p-6 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full object-cover opacity-30 bg-cover bg-center transition-opacity duration-300"
          style={{ backgroundImage: `url(${emergencyHero})` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Phone className="h-8 w-8" />
              Emergency Contacts
            </h1>
            <p className="text-lg opacity-90">Quick access to local emergency services</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <MapPin className="h-3 w-3 mr-1" />
              {selectedRegion}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Emergency Numbers */}
      <Card className="shadow-card bg-gradient-to-r from-destructive/10 to-warning/10 border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-destructive" />
            National Emergency Numbers
          </CardTitle>
          <CardDescription>These numbers work across all states in India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 bg-background hover:bg-destructive hover:text-white border-destructive/30"
              onClick={() => callContact('100', 'Police')}
            >
              <Shield className="h-6 w-6" />
              <span className="font-semibold">Police</span>
              <span className="text-lg font-bold">100</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 bg-background hover:bg-destructive hover:text-white border-destructive/30"
              onClick={() => callContact('101', 'Fire Services')}
            >
              <Flame className="h-6 w-6" />
              <span className="font-semibold">Fire</span>
              <span className="text-lg font-bold">101</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 bg-background hover:bg-success hover:text-white border-success/30"
              onClick={() => callContact('108', 'Medical Emergency')}
            >
              <Heart className="h-6 w-6" />
              <span className="font-semibold">Medical</span>
              <span className="text-lg font-bold">108</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 bg-background hover:bg-warning hover:text-white border-warning/30"
              onClick={() => callContact('1077', 'Disaster Management')}
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="font-semibold">Disaster</span>
              <span className="text-lg font-bold">1077</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emergency contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(emergencyContacts).map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {contactTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="shadow-card hover:shadow-hover transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(contact.type)}/20`}>
                    <contact.icon className={`h-5 w-5 ${getTypeColor(contact.type).replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{contact.name}</CardTitle>
                    <Badge variant="outline" className={`${getTypeColor(contact.type)} text-white border-0 text-xs mt-1`}>
                      {contact.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{contact.number}</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    {contact.available}
                  </Badge>
                </div>
                
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  onClick={() => callContact(contact.number, contact.name)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const EmergencyContacts: React.FC = () => {
  return (
    <Layout>
      <EmergencyContactsContent />
    </Layout>
  );
};
