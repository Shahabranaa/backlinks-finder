
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, User, BookOpen } from 'lucide-react';

interface BacklinkTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

const BacklinkTypeSelector: React.FC<BacklinkTypeSelectorProps> = ({
  selectedTypes,
  onSelectionChange,
}) => {
  const backlinkTypes = [
    {
      id: 'profile',
      name: 'Profile Backlinks',
      description: 'Create profiles on high-authority websites',
      icon: User,
      difficulty: 'Easy',
      timeframe: '2-5 minutes per site',
    },
    {
      id: 'forum',
      name: 'Forum Participation',
      description: 'Engage in relevant forum discussions',
      icon: Users,
      difficulty: 'Medium',
      timeframe: '10-15 minutes per post',
    },
    {
      id: 'comment',
      name: 'Blog Comments',
      description: 'Leave valuable comments on relevant blogs',
      icon: MessageSquare,
      difficulty: 'Medium',
      timeframe: '5-10 minutes per comment',
    },
    {
      id: 'directory',
      name: 'Directory Listings',
      description: 'Submit to quality web directories',
      icon: BookOpen,
      difficulty: 'Easy',
      timeframe: '3-7 minutes per directory',
    },
  ];

  const handleTypeToggle = (typeId: string) => {
    const newSelection = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId];
    onSelectionChange(newSelection);
  };

  const handleCheckboxChange = (typeId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedTypes, typeId]
      : selectedTypes.filter(t => t !== typeId);
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Backlink Types</h3>
      <div className="grid grid-cols-1 gap-3">
        {backlinkTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedTypes.includes(type.id);
          
          return (
            <div
              key={type.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    // Prevent event bubbling to avoid double triggering
                    handleCheckboxChange(type.id, checked === true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
                <Icon className="w-5 h-5 mt-1 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{type.name}</h4>
                    <Badge variant={type.difficulty === 'Easy' ? 'default' : 'secondary'}>
                      {type.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  <p className="text-xs text-gray-500 mt-1">⏱️ {type.timeframe}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BacklinkTypeSelector;
