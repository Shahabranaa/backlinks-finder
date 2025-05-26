
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link, Globe, MessageSquare, Users, TrendingUp, Shield } from 'lucide-react';
import BacklinkTypeSelector from '@/components/BacklinkTypeSelector';
import QualityGuidelines from '@/components/QualityGuidelines';
import ProgressTracker from '@/components/ProgressTracker';
import DashboardStats from '@/components/DashboardStats';
import BacklinkResults, { CreatedBacklink } from '@/components/BacklinkResults';

const Index = () => {
  const [domain, setDomain] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [createdBacklinks, setCreatedBacklinks] = useState<CreatedBacklink[]>([]);
  const { toast } = useToast();

  // Mock backlink platforms for each type
  const backlinkPlatforms = {
    profile: [
      { name: 'GitHub', url: 'https://github.com', description: 'Developer profile with project showcase' },
      { name: 'LinkedIn', url: 'https://linkedin.com', description: 'Professional network profile' },
      { name: 'About.me', url: 'https://about.me', description: 'Personal branding page' },
      { name: 'AngelList', url: 'https://angel.co', description: 'Startup ecosystem profile' },
    ],
    forum: [
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Technical discussion and solution' },
      { name: 'Reddit r/webdev', url: 'https://reddit.com/r/webdev', description: 'Community discussion post' },
      { name: 'Hacker News', url: 'https://news.ycombinator.com', description: 'Tech community engagement' },
      { name: 'Dev Community', url: 'https://dev.to', description: 'Developer forum participation' },
    ],
    comment: [
      { name: 'TechCrunch', url: 'https://techcrunch.com', description: 'Insightful comment on tech article' },
      { name: 'Smashing Magazine', url: 'https://smashingmagazine.com', description: 'Expert comment on design article' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com', description: 'Technical insight on development post' },
      { name: 'A List Apart', url: 'https://alistapart.com', description: 'Professional comment on industry article' },
    ],
    directory: [
      { name: 'Clutch', url: 'https://clutch.co', description: 'Business directory listing' },
      { name: 'Crunchbase', url: 'https://crunchbase.com', description: 'Company database entry' },
      { name: 'Product Hunt', url: 'https://producthunt.com', description: 'Product showcase listing' },
      { name: 'Startupliit', url: 'https://startupliit.com', description: 'Startup directory submission' },
    ],
  };

  const simulateBacklinkCreation = (type: string, platforms: any[]) => {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const backlink: CreatedBacklink = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      platform: platform.name,
      url: platform.url,
      type,
      status: 'pending',
      createdAt: new Date(),
      description: platform.description,
    };

    setCreatedBacklinks(prev => [...prev, backlink]);

    // Simulate completion after a delay
    setTimeout(() => {
      setCreatedBacklinks(prev => 
        prev.map(bl => 
          bl.id === backlink.id 
            ? { ...bl, status: Math.random() > 0.1 ? 'success' : 'failed' }
            : bl
        )
      );
    }, 2000 + Math.random() * 3000);
  };

  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || selectedTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a domain and select at least one backlink type.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCreatedBacklinks([]);

    // Simulate the backlink creation process
    const totalBacklinks = selectedTypes.length * 3; // 3 backlinks per type
    let currentBacklink = 0;

    const createBacklinksForType = (typeIndex: number) => {
      if (typeIndex >= selectedTypes.length) {
        setIsProcessing(false);
        setProgress(100);
        toast({
          title: "Backlink Creation Complete",
          description: `Successfully created ${createdBacklinks.length} high-quality backlinks for ${domain}`,
        });
        return;
      }

      const currentType = selectedTypes[typeIndex];
      const platforms = backlinkPlatforms[currentType as keyof typeof backlinkPlatforms];
      
      // Create 3 backlinks for this type
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          simulateBacklinkCreation(currentType, platforms);
          currentBacklink++;
          setProgress((currentBacklink / totalBacklinks) * 100);
          
          // Move to next type after all backlinks for current type are initiated
          if (i === 2) {
            setTimeout(() => createBacklinksForType(typeIndex + 1), 1000);
          }
        }, i * 1500);
      }
    };

    createBacklinksForType(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BacklinkPro
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automate high-quality backlink creation to boost your website's authority and search rankings
          </p>
        </div>

        <Tabs defaultValue="create" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Backlinks</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Domain Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Domain Setup
                  </CardTitle>
                  <CardDescription>
                    Enter your website domain to start creating backlinks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDomainSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="domain">Website Domain</Label>
                      <Input
                        id="domain"
                        type="url"
                        placeholder="https://codefinity.net"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <BacklinkTypeSelector 
                      selectedTypes={selectedTypes}
                      onSelectionChange={setSelectedTypes}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Creating Backlinks...' : 'Start Backlink Creation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Progress Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Progress Tracker
                  </CardTitle>
                  <CardDescription>
                    Monitor your backlink creation progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressTracker 
                    progress={progress}
                    isProcessing={isProcessing}
                    selectedTypes={selectedTypes}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Backlink Results */}
            <BacklinkResults 
              backlinks={createdBacklinks}
              isProcessing={isProcessing}
            />

            {/* Quality Assurance Banner */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800">Quality First Approach</h3>
                    <p className="text-green-700">
                      Our system creates only high-quality, relevant backlinks that comply with search engine guidelines
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="guidelines">
            <QualityGuidelines />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
