
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Globe, FileText, AlignLeft } from 'lucide-react';

interface WebsiteDetails {
  domain: string;
  title: string;
  description: string;
}

interface WebsiteDetailsFormProps {
  onSubmit: (details: WebsiteDetails) => void;
  initialDomain?: string;
}

const WebsiteDetailsForm: React.FC<WebsiteDetailsFormProps> = ({ onSubmit, initialDomain = '' }) => {
  const [details, setDetails] = useState<WebsiteDetails>({
    domain: initialDomain,
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.domain && details.title && details.description) {
      onSubmit(details);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Website Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="domain" className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Website Domain
            </Label>
            <Input
              id="domain"
              type="url"
              placeholder="https://codefinity.net"
              value={details.domain}
              onChange={(e) => setDetails(prev => ({ ...prev, domain: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="title" className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Website Title
            </Label>
            <Input
              id="title"
              placeholder="CodeFinity - Learn to Code"
              value={details.title}
              onChange={(e) => setDetails(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="flex items-center">
              <AlignLeft className="w-4 h-4 mr-1" />
              Website Description
            </Label>
            <Textarea
              id="description"
              placeholder="A comprehensive platform for learning programming languages, web development, and software engineering skills through interactive courses and hands-on projects."
              value={details.description}
              onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Continue to Backlink Creation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WebsiteDetailsForm;
