
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockPolls, mockTopics } from "@/data/mockData";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("all");
  
  // Prepare data for charts
  const pollVotesData = mockPolls.map(poll => ({
    name: poll.question.length > 30 ? poll.question.substring(0, 30) + '...' : poll.question,
    votes: poll.totalVotes,
  }));
  
  const topicDistributionData = mockTopics.map(topic => ({
    name: topic.title,
    value: topic.pollCount,
  }));
  
  const COLORS = ['#6E59A5', '#9B87F5', '#1EAEDB', '#4CAF50', '#FFC107', '#FF5722'];
  
  // Mock time series data for engagement
  const engagementData = [
    { date: 'Jan', votes: 120 },
    { date: 'Feb', votes: 180 },
    { date: 'Mar', votes: 250 },
    { date: 'Apr', votes: 320 },
    { date: 'May', votes: 280 },
    { date: 'Jun', votes: 350 },
    { date: 'Jul', votes: 410 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">
          Explore data and trends across your YourViews platform
        </p>
      </div>
      
      <div className="mb-8 flex justify-between items-center">
        <Tabs defaultValue="engagement" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTimeRange("week")}
                className={timeRange === "week" ? "bg-brand-purple" : ""}
              >
                Week
              </Button>
              <Button 
                variant={timeRange === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTimeRange("month")}
                className={timeRange === "month" ? "bg-brand-purple" : ""}
              >
                Month
              </Button>
              <Button 
                variant={timeRange === "year" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTimeRange("year")}
                className={timeRange === "year" ? "bg-brand-purple" : ""}
              >
                Year
              </Button>
              <Button 
                variant={timeRange === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTimeRange("all")}
                className={timeRange === "all" ? "bg-brand-purple" : ""}
              >
                All Time
              </Button>
            </div>
          </div>
          
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Over Time</CardTitle>
                <CardDescription>
                  Number of votes cast per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="votes" stroke="#6E59A5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Polls</CardTitle>
                  <CardDescription>
                    Polls with the most votes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pollVotesData.slice(0, 5)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#6E59A5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Topic Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of polls by topic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topicDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topicDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Engagement Analysis</CardTitle>
                <CardDescription>
                  Compare engagement across different topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTopics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pollCount" name="Number of Polls" fill="#6E59A5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demographics Overview</CardTitle>
                <CardDescription>
                  Analysis of user demographics will be available once Supabase integration is complete
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    Demographic data will be available after integrating with Supabase
                    and collecting more user profile information.
                  </p>
                  <Button className="bg-brand-purple hover:bg-brand-light-purple">
                    Connect Supabase
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>
            Download analytics data for offline analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              Export as CSV
            </Button>
            <Button variant="outline">
              Export as JSON
            </Button>
            <Button variant="outline">
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
