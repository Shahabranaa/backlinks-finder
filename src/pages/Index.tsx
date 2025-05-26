
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

const Index = () => {
  const [domain, setDomain] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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

    // Simulate the backlink creation process
    const steps = selectedTypes.length * 10;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / steps);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Backlink Creation Complete",
            description: `Successfully created high-quality backlinks for ${domain}`,
          });
          return 100;
        }
        return newProgress;
      });
    }, 200);
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
