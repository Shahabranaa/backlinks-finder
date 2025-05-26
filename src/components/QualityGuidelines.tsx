
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield, Target, Award } from 'lucide-react';

const QualityGuidelines = () => {
  const bestPractices = [
    {
      title: 'Relevance is Key',
      description: 'Only create backlinks on platforms relevant to your industry or niche',
      icon: Target,
      type: 'success',
    },
    {
      title: 'Quality Over Quantity',
      description: 'Focus on high-authority sites rather than creating many low-quality links',
      icon: Award,
      type: 'success',
    },
    {
      title: 'Natural Link Building',
      description: 'Ensure backlinks appear natural and provide genuine value to users',
      icon: Shield,
      type: 'success',
    },
  ];

  const dosList = [
    'Create genuine, valuable profiles with complete information',
    'Participate meaningfully in forum discussions',
    'Leave thoughtful, relevant comments on blog posts',
    'Use varied anchor text that sounds natural',
    'Maintain consistent branding across platforms',
    'Follow each platform\'s terms of service',
  ];

  const dontsList = [
    'Create multiple fake profiles on the same platform',
    'Use identical content across all backlinks',
    'Over-optimize anchor text with exact keywords',
    'Spam forums or comment sections',
    'Buy or exchange links in bulk',
    'Create backlinks on irrelevant or low-quality sites',
  ];

  const qualityFactors = [
    { factor: 'Domain Authority', weight: 'High', description: 'Target sites with DA 30+' },
    { factor: 'Relevance', weight: 'Critical', description: 'Must be industry-related' },
    { factor: 'Traffic', weight: 'Medium', description: 'Active user engagement' },
    { factor: 'Content Quality', weight: 'High', description: 'Well-maintained, updated content' },
  ];

  return (
    <div className="space-y-6">
      {/* Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bestPractices.map((practice, index) => {
          const Icon = practice.icon;
          return (
            <Card key={index} className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg text-green-800">{practice.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">{practice.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Do's */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Best Practices - DO
            </CardTitle>
            <CardDescription>
              Follow these guidelines for effective backlink building
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dosList.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Don'ts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <XCircle className="w-5 h-5 mr-2" />
              Avoid These - DON'T
            </CardTitle>
            <CardDescription>
              Practices that can harm your SEO and get you penalized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dontsList.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quality Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
            Quality Assessment Factors
          </CardTitle>
          <CardDescription>
            How we evaluate potential backlink opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{factor.factor}</h4>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
                <Badge 
                  variant={factor.weight === 'Critical' ? 'destructive' : 
                           factor.weight === 'High' ? 'default' : 'secondary'}
                >
                  {factor.weight}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Reminder</h3>
              <p className="text-amber-700 text-sm">
                This tool is designed to help you create legitimate, high-quality backlinks that provide real value. 
                Always ensure your backlink strategy complies with search engine guidelines and focuses on building 
                genuine relationships within your industry community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityGuidelines;
