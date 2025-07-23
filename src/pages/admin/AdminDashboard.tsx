import React from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Vote, FileQuestion, BarChart3, Loader2, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Poll } from "@/types";

// Fetch functions
const fetchTotalUsers = async (): Promise<number> => {
  const queryPromise = supabase.from("user_profile").select("user_id", { count: "exact" });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("user_profile query timed out after 30s")), 30000)
  );
  const { count, error } = await Promise.race([queryPromise, timeoutPromise]);
  if (error) throw new Error(error.message);
  return count || 0;
};

const fetchTotalPolls = async (): Promise<number> => {
  const { count, error } = await supabase.from("poll_item").select("poll_id", { count: "exact" });
  if (error) throw new Error(error.message);
  return count || 0;
};

const fetchPollsForChart = async (): Promise<Poll[]> => {
  const { data, error } = await supabase
    .from("poll_vote_summary")
    .select("poll_title, total_votes")
    .order("total_votes", { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);
  return data.map(p => ({ poll_title: p.poll_title, total_votes: p.total_votes }));
};

const fetchDemographicsSummary = async () => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("age, gender, location, education, occupation");
  if (error) throw new Error(error.message);
  return data;
};

const AdminDashboard = () => {
  const { data: totalUsers, isLoading: usersLoading, isError: usersError, error: usersErrorMessage } = useQuery<number>({
    queryKey: ["totalUsers"],
    queryFn: fetchTotalUsers,
  });

  const { data: totalPolls, isLoading: pollsLoading, isError: pollsError, error: pollsErrorMessage } = useQuery<number>({
    queryKey: ["totalPolls"],
    queryFn: fetchTotalPolls,
  });

  const { data: topPolls, isLoading: topPollsLoading, isError: topPollsError, error: topPollsErrorMessage } = useQuery<Poll[]>({
    queryKey: ["topPolls"],
    queryFn: fetchPollsForChart,
  });

  const { data: demographics, isLoading: demoLoading, isError: demoError, error: demoErrorMessage } = useQuery({
    queryKey: ["demographicsSummary"],
    queryFn: fetchDemographicsSummary,
  });

  const isLoading = usersLoading || pollsLoading || topPollsLoading || demoLoading;
  const isError = usersError || pollsError || topPollsError || demoError;
  const errorMessage = usersErrorMessage?.message || pollsErrorMessage?.message || topPollsErrorMessage?.message || demoErrorMessage?.message;

  const totalVotes = topPolls?.reduce((sum, poll) => sum + poll.total_votes, 0) || 0;
  const averageVotesPerPoll = totalPolls && totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0;

  const pollVotesData = topPolls?.map(poll => ({
    name: poll.poll_title.length > 30 ? poll.poll_title.substring(0, 30) + '...' : poll.poll_title,
    votes: poll.total_votes,
  })) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-red-800 mb-2">Error loading dashboard data</h3>
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

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
          value={totalUsers?.toString() || "0"}
          icon={<Users className="h-5 w-5 text-brand-purple" />}
          description="Active accounts"
          trend={{ value: 12, isPositive: true }} // Placeholder
        />
        
        <StatsCard
          title="Total Votes"
          value={totalVotes.toString()}
          icon={<Vote className="h-5 w-5 text-brand-blue" />}
          description="Across all polls"
          trend={{ value: 23, isPositive: true }} // Placeholder
        />
        
        <StatsCard
          title="Active Polls"
          value={totalPolls?.toString() || "0"}
          icon={<FileQuestion className="h-5 w-5 text-green-500" />}
          description="Currently running"
        />
        
        <StatsCard
          title="Avg. Votes Per Poll"
          value={averageVotesPerPoll.toString()}
          icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
          trend={{ value: 8, isPositive: true }} // Placeholder
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
              {topPolls?.slice(0, 5).map((poll, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">New votes on "{poll.poll_title.substring(0, 40)}..."</p>
                    <p className="text-xs text-gray-500">Poll ID: {poll.poll_id}</p>
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
            {demographics && demographics.length > 0 ? (
              <div className="h-80">
                <p>Demographic data placeholder (e.g., age distribution).</p>
              </div>
            ) : (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">
                  Demographics data will be available once more users sign up and provide details.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
