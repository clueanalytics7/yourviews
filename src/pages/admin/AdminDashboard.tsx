
import React from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Vote, FileQuestion, BarChart3 } from "lucide-react";
import { mockPolls, mockTopics } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Prepare data for charts
const pollVotesData = mockPolls.map(poll => ({
  name: poll.question.length > 30 ? poll.question.substring(0, 30) + '...' : poll.question,
  votes: poll.totalVotes,
})).slice(0, 5);

const AdminDashboard = () => {
  // Calculate stats
  const totalPolls = mockPolls.length;
  const totalTopics = mockTopics.length;
  const totalVotes = mockPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  const averageVotesPerPoll = Math.round(totalVotes / totalPolls);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your YourViews platform statistics and activity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value="253"
          icon={<Users className="h-5 w-5 text-brand-purple" />}
          description="Active accounts"
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatsCard
          title="Total Votes"
          value={totalVotes.toString()}
          icon={<Vote className="h-5 w-5 text-brand-blue" />}
          description="Across all polls"
          trend={{ value: 23, isPositive: true }}
        />
        
        <StatsCard
          title="Active Polls"
          value={totalPolls.toString()}
          icon={<FileQuestion className="h-5 w-5 text-green-500" />}
          description="Currently running"
        />
        
        <StatsCard
          title="Avg. Votes Per Poll"
          value={averageVotesPerPoll.toString()}
          icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Polls by Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pollVotesData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#6E59A5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPolls.slice(0, 5).map((poll, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">New votes on "{poll.question.substring(0, 40)}..."</p>
                    <p className="text-xs text-gray-500">Poll ID: {poll.id}</p>
                  </div>
                  <div className="text-sm font-medium text-brand-purple">
                    +{Math.floor(Math.random() * 20) + 1} votes
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">
                Demographics data will be available once Supabase integration is complete and more users sign up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
