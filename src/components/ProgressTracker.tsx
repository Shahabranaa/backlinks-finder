
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressTrackerProps {
  progress: number;
  isProcessing: boolean;
  selectedTypes: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  isProcessing,
  selectedTypes,
}) => {
  const getStatusIcon = () => {
    if (progress === 100) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (isProcessing) return <Clock className="w-5 h-5 text-blue-600" />;
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (progress === 100) return 'Completed Successfully';
    if (isProcessing) return 'Creating Backlinks...';
    return 'Ready to Start';
  };

  const getStatusColor = () => {
    if (progress === 100) return 'bg-green-100 text-green-800';
    if (isProcessing) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <Badge className={getStatusColor()}>
          {Math.round(progress)}%
        </Badge>
      </div>

      <Progress value={progress} className="h-3" />

      {selectedTypes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Backlink Types:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Analyzing domain authority and niche relevance</p>
          <p>• Finding high-quality platforms for backlink creation</p>
          <p>• Creating authentic, valuable content</p>
          <p>• Ensuring compliance with platform guidelines</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
