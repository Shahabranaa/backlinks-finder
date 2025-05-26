
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Link, Users, MessageSquare, Calendar } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    { title: 'Total Backlinks Created', value: '1,247', change: '+12%', icon: Link },
    { title: 'Domain Authority Boost', value: '+15', change: '+3 this month', icon: TrendingUp },
    { title: 'Active Campaigns', value: '8', change: '2 completed today', icon: Users },
    { title: 'Quality Score', value: '94%', change: 'Excellent', icon: MessageSquare },
  ];

  const recentActivity = [
    { action: 'Profile created on TechCrunch', domain: 'codefinity.net', time: '2 hours ago', status: 'success' },
    { action: 'Forum post on Stack Overflow', domain: 'codefinity.net', time: '4 hours ago', status: 'success' },
    { action: 'Blog comment on Dev.to', domain: 'codefinity.net', time: '6 hours ago', status: 'pending' },
    { action: 'Directory submission to Clutch', domain: 'codefinity.net', time: '1 day ago', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest backlink creation activities across your domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">Domain: {activity.domain}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : 'secondary'}
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Backlink Performance Over Time</CardTitle>
          <CardDescription>
            Track your domain authority and ranking improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Performance analytics chart will appear here</p>
              <p className="text-sm text-gray-500">Data visualization coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
