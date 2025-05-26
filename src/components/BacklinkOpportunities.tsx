
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Globe, Star } from 'lucide-react';

export interface BacklinkOpportunity {
  id: string;
  platform: string;
  url: string;
  type: string;
  domainAuthority: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  estimatedTime: string;
}

interface BacklinkOpportunitiesProps {
  opportunities: BacklinkOpportunity[];
  onCreateBacklinks: (selectedOpportunities: BacklinkOpportunity[]) => void;
  isLoading: boolean;
}

const BacklinkOpportunities: React.FC<BacklinkOpportunitiesProps> = ({
  opportunities,
  onCreateBacklinks,
  isLoading
}) => {
  const [selectedOpportunities, setSelectedOpportunities] = React.useState<string[]>([]);

  const handleOpportunityToggle = (opportunityId: string) => {
    setSelectedOpportunities(prev =>
      prev.includes(opportunityId)
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    );
  };

  const handleCreateBacklinks = () => {
    const selected = opportunities.filter(opp => selectedOpportunities.includes(opp.id));
    onCreateBacklinks(selected);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile': return 'bg-blue-100 text-blue-800';
      case 'forum': return 'bg-purple-100 text-purple-800';
      case 'comment': return 'bg-orange-100 text-orange-800';
      case 'directory': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Backlink Opportunities ({opportunities.length} found)
          </div>
          <Button 
            onClick={handleCreateBacklinks}
            disabled={selectedOpportunities.length === 0 || isLoading}
            className="ml-4"
          >
            Create Selected Backlinks ({selectedOpportunities.length})
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {opportunities.map((opportunity) => (
            <div 
              key={opportunity.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOpportunities.includes(opportunity.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOpportunityToggle(opportunity.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle 
                      className={`w-4 h-4 ${
                        selectedOpportunities.includes(opportunity.id) 
                          ? 'text-blue-600' 
                          : 'text-gray-300'
                      }`} 
                    />
                    <h4 className="font-medium">{opportunity.platform}</h4>
                    <Badge className={getTypeColor(opportunity.type)} variant="outline">
                      {opportunity.type}
                    </Badge>
                    <Badge className={getDifficultyColor(opportunity.difficulty)}>
                      {opportunity.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span>DA: {opportunity.domainAuthority}</span>
                      </div>
                      <span className="text-gray-500">⏱️ {opportunity.estimatedTime}</span>
                    </div>
                    
                    <a
                      href={opportunity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Site <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BacklinkOpportunities;
