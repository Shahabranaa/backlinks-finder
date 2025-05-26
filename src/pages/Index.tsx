
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link, Globe, TrendingUp, Shield, Search } from 'lucide-react';
import BacklinkTypeSelector from '@/components/BacklinkTypeSelector';
import QualityGuidelines from '@/components/QualityGuidelines';
import ProgressTracker from '@/components/ProgressTracker';
import DashboardStats from '@/components/DashboardStats';
import BacklinkResults, { CreatedBacklink } from '@/components/BacklinkResults';
import WebsiteDetailsForm from '@/components/WebsiteDetailsForm';
import BacklinkOpportunities, { BacklinkOpportunity } from '@/components/BacklinkOpportunities';
import { fetchBacklinkOpportunities, WebsiteDetails } from '@/services/backlinkService';

const Index = () => {
  const [step, setStep] = useState<'details' | 'types' | 'opportunities' | 'creation'>('details');
  const [websiteDetails, setWebsiteDetails] = useState<WebsiteDetails | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<BacklinkOpportunity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingOpportunities, setIsFetchingOpportunities] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdBacklinks, setCreatedBacklinks] = useState<CreatedBacklink[]>([]);
  const { toast } = useToast();

  const handleWebsiteDetailsSubmit = (details: WebsiteDetails) => {
    setWebsiteDetails(details);
    setStep('types');
  };

  const handleTypesSelected = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one backlink type.",
        variant: "destructive",
      });
      return;
    }

    setStep('opportunities');
    setIsFetchingOpportunities(true);

    try {
      const fetchedOpportunities = await fetchBacklinkOpportunities(websiteDetails!, selectedTypes);
      setOpportunities(fetchedOpportunities);
      toast({
        title: "Opportunities Found",
        description: `Found ${fetchedOpportunities.length} potential backlink opportunities`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch backlink opportunities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingOpportunities(false);
    }
  };

  const simulateBacklinkCreation = (opportunity: BacklinkOpportunity) => {
    const backlink: CreatedBacklink = {
      id: `created-${opportunity.id}-${Date.now()}`,
      platform: opportunity.platform,
      url: opportunity.url,
      type: opportunity.type,
      status: 'pending',
      createdAt: new Date(),
      description: `Creating ${opportunity.type} backlink on ${opportunity.platform}`,
    };

    setCreatedBacklinks(prev => [...prev, backlink]);

    // Simulate completion after a delay
    setTimeout(() => {
      setCreatedBacklinks(prev => 
        prev.map(bl => 
          bl.id === backlink.id 
            ? { ...bl, status: Math.random() > 0.15 ? 'success' : 'failed' }
            : bl
        )
      );
    }, 2000 + Math.random() * 3000);
  };

  const handleCreateBacklinks = async (selectedOpportunities: BacklinkOpportunity[]) => {
    setStep('creation');
    setIsProcessing(true);
    setProgress(0);
    setCreatedBacklinks([]);

    const totalBacklinks = selectedOpportunities.length;
    let currentBacklink = 0;

    // Create backlinks one by one
    for (const opportunity of selectedOpportunities) {
      setTimeout(() => {
        simulateBacklinkCreation(opportunity);
        currentBacklink++;
        setProgress((currentBacklink / totalBacklinks) * 100);
        
        if (currentBacklink === totalBacklinks) {
          setTimeout(() => {
            setIsProcessing(false);
            toast({
              title: "Backlink Creation Complete",
              description: `Successfully processed ${totalBacklinks} backlink opportunities for ${websiteDetails?.title}`,
            });
          }, 1000);
        }
      }, currentBacklink * 2000);
    }
  };

  const handleStartOver = () => {
    setStep('details');
    setWebsiteDetails(null);
    setSelectedTypes([]);
    setOpportunities([]);
    setCreatedBacklinks([]);
    setProgress(0);
    setIsProcessing(false);
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
            {/* Progress Steps */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-blue-600' : step === 'types' || step === 'opportunities' || step === 'creation' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-100' : step === 'types' || step === 'opportunities' || step === 'creation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      1
                    </div>
                    <span className="text-sm font-medium">Website Details</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${step === 'types' ? 'text-blue-600' : step === 'opportunities' || step === 'creation' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'types' ? 'bg-blue-100' : step === 'opportunities' || step === 'creation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      2
                    </div>
                    <span className="text-sm font-medium">Select Types</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${step === 'opportunities' ? 'text-blue-600' : step === 'creation' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'opportunities' ? 'bg-blue-100' : step === 'creation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      3
                    </div>
                    <span className="text-sm font-medium">Review Opportunities</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${step === 'creation' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'creation' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      4
                    </div>
                    <span className="text-sm font-medium">Create Backlinks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Website Details */}
            {step === 'details' && (
              <WebsiteDetailsForm onSubmit={handleWebsiteDetailsSubmit} />
            )}

            {/* Step 2: Backlink Types */}
            {step === 'types' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Domain:</strong> {websiteDetails?.domain}</div>
                      <div><strong>Title:</strong> {websiteDetails?.title}</div>
                      <div><strong>Description:</strong> {websiteDetails?.description}</div>
                    </div>
                    <Button onClick={() => setStep('details')} variant="outline" className="mt-4">
                      Edit Details
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select Backlink Types</CardTitle>
                    <CardDescription>
                      Choose the types of backlinks you want to create
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BacklinkTypeSelector 
                      selectedTypes={selectedTypes}
                      onSelectionChange={setSelectedTypes}
                    />
                    <Button onClick={handleTypesSelected} className="w-full mt-4">
                      <Search className="w-4 h-4 mr-2" />
                      Find Backlink Opportunities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Backlink Opportunities */}
            {step === 'opportunities' && (
              <div className="space-y-6">
                {isFetchingOpportunities ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Search className="w-5 h-5 animate-spin text-blue-600" />
                        <span>Searching for high-quality backlink opportunities...</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Found {opportunities.length} Opportunities</h3>
                        <p className="text-gray-600">Select the platforms where you'd like to create backlinks</p>
                      </div>
                      <Button onClick={() => setStep('types')} variant="outline">
                        Back to Types
                      </Button>
                    </div>
                    <BacklinkOpportunities
                      opportunities={opportunities}
                      onCreateBacklinks={handleCreateBacklinks}
                      isLoading={isProcessing}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 4: Backlink Creation */}
            {step === 'creation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Creating Backlinks</h3>
                    <p className="text-gray-600">Processing selected opportunities for {websiteDetails?.title}</p>
                  </div>
                  {!isProcessing && (
                    <Button onClick={handleStartOver} variant="outline">
                      Start Over
                    </Button>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Progress Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressTracker 
                      progress={progress}
                      isProcessing={isProcessing}
                      selectedTypes={selectedTypes}
                    />
                  </CardContent>
                </Card>

                <BacklinkResults 
                  backlinks={createdBacklinks}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Quality Assurance Banner */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800">Quality First Approach</h3>
                    <p className="text-green-700">
                      Our system finds and creates only high-quality, relevant backlinks that comply with search engine guidelines
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
