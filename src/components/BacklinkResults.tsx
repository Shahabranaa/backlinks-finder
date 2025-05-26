
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface CreatedBacklink {
  id: string;
  platform: string;
  url: string;
  type: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
  description: string;
}

interface BacklinkResultsProps {
  backlinks: CreatedBacklink[];
  isProcessing: boolean;
}

const BacklinkResults: React.FC<BacklinkResultsProps> = ({ backlinks, isProcessing }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile':
        return 'bg-blue-100 text-blue-800';
      case 'forum':
        return 'bg-purple-100 text-purple-800';
      case 'comment':
        return 'bg-orange-100 text-orange-800';
      case 'directory':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isProcessing && backlinks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ExternalLink className="w-5 h-5 mr-2" />
          Created Backlinks ({backlinks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {backlinks.map((backlink) => (
            <div key={backlink.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(backlink.status)}
                    <h4 className="font-medium text-sm">{backlink.platform}</h4>
                    <Badge className={getTypeColor(backlink.type)} variant="outline">
                      {backlink.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{backlink.description}</p>
                  <div className="flex items-center justify-between">
                    <a
                      href={backlink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                    >
                      View Backlink <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <Badge className={getStatusColor(backlink.status)}>
                      {backlink.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-800">Creating new backlinks...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BacklinkResults;
