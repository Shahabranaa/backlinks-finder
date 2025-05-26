
import { BacklinkOpportunity } from '@/components/BacklinkOpportunities';

export interface WebsiteDetails {
  domain: string;
  title: string;
  description: string;
}

// Mock data for different backlink types
const backlinkOpportunitiesData = {
  profile: [
    {
      platform: 'GitHub',
      url: 'https://github.com',
      domainAuthority: 95,
      difficulty: 'Easy' as const,
      description: 'Create a developer profile with project showcase and bio',
      estimatedTime: '5-10 minutes'
    },
    {
      platform: 'AngelList',
      url: 'https://angel.co',
      domainAuthority: 85,
      difficulty: 'Medium' as const,
      description: 'Professional startup ecosystem profile',
      estimatedTime: '10-15 minutes'
    },
    {
      platform: 'About.me',
      url: 'https://about.me',
      domainAuthority: 78,
      difficulty: 'Easy' as const,
      description: 'Personal branding page with custom design',
      estimatedTime: '5-8 minutes'
    },
    {
      platform: 'Behance',
      url: 'https://behance.net',
      domainAuthority: 88,
      difficulty: 'Easy' as const,
      description: 'Creative portfolio showcase platform',
      estimatedTime: '8-12 minutes'
    }
  ],
  forum: [
    {
      platform: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      domainAuthority: 97,
      difficulty: 'Hard' as const,
      description: 'Answer technical questions and build reputation',
      estimatedTime: '20-30 minutes'
    },
    {
      platform: 'Reddit Programming',
      url: 'https://reddit.com/r/programming',
      domainAuthority: 91,
      difficulty: 'Medium' as const,
      description: 'Engage in programming discussions',
      estimatedTime: '10-20 minutes'
    },
    {
      platform: 'Dev Community',
      url: 'https://dev.to',
      domainAuthority: 82,
      difficulty: 'Easy' as const,
      description: 'Share programming knowledge and experiences',
      estimatedTime: '15-25 minutes'
    },
    {
      platform: 'Hacker News',
      url: 'https://news.ycombinator.com',
      domainAuthority: 93,
      difficulty: 'Hard' as const,
      description: 'Participate in tech industry discussions',
      estimatedTime: '15-30 minutes'
    }
  ],
  comment: [
    {
      platform: 'TechCrunch',
      url: 'https://techcrunch.com',
      domainAuthority: 92,
      difficulty: 'Medium' as const,
      description: 'Comment on relevant tech industry articles',
      estimatedTime: '5-10 minutes'
    },
    {
      platform: 'Smashing Magazine',
      url: 'https://smashingmagazine.com',
      domainAuthority: 86,
      difficulty: 'Easy' as const,
      description: 'Share insights on web development articles',
      estimatedTime: '5-8 minutes'
    },
    {
      platform: 'CSS-Tricks',
      url: 'https://css-tricks.com',
      domainAuthority: 84,
      difficulty: 'Easy' as const,
      description: 'Contribute to frontend development discussions',
      estimatedTime: '5-10 minutes'
    },
    {
      platform: 'A List Apart',
      url: 'https://alistapart.com',
      domainAuthority: 81,
      difficulty: 'Medium' as const,
      description: 'Engage with design and development content',
      estimatedTime: '8-15 minutes'
    }
  ],
  directory: [
    {
      platform: 'Product Hunt',
      url: 'https://producthunt.com',
      domainAuthority: 89,
      difficulty: 'Easy' as const,
      description: 'Submit and showcase your product',
      estimatedTime: '10-15 minutes'
    },
    {
      platform: 'Crunchbase',
      url: 'https://crunchbase.com',
      domainAuthority: 94,
      difficulty: 'Medium' as const,
      description: 'Create comprehensive company profile',
      estimatedTime: '15-20 minutes'
    },
    {
      platform: 'Clutch',
      url: 'https://clutch.co',
      domainAuthority: 87,
      difficulty: 'Medium' as const,
      description: 'Business services directory listing',
      estimatedTime: '12-18 minutes'
    },
    {
      platform: 'Startupliit',
      url: 'https://startupliit.com',
      domainAuthority: 75,
      difficulty: 'Easy' as const,
      description: 'Startup directory submission',
      estimatedTime: '5-10 minutes'
    }
  ]
};

export const fetchBacklinkOpportunities = async (
  websiteDetails: WebsiteDetails,
  selectedTypes: string[]
): Promise<BacklinkOpportunity[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const opportunities: BacklinkOpportunity[] = [];

  selectedTypes.forEach(type => {
    const typeData = backlinkOpportunitiesData[type as keyof typeof backlinkOpportunitiesData];
    if (typeData) {
      // Add some variety by randomly selecting 2-4 opportunities per type
      const count = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...typeData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      selected.forEach((item, index) => {
        opportunities.push({
          id: `${type}-${index}-${Date.now()}`,
          platform: item.platform,
          url: item.url,
          type,
          domainAuthority: item.domainAuthority,
          difficulty: item.difficulty,
          description: item.description,
          estimatedTime: item.estimatedTime
        });
      });
    }
  });

  console.log(`Found ${opportunities.length} backlink opportunities for ${websiteDetails.domain}`);
  return opportunities;
};
