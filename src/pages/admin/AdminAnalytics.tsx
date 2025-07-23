import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
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
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

const fetchAnalyticsData = async () => {
  const { data: polls, error: pollsError } = await supabase.from("poll_vote_summary").select("poll_id, poll_title, total_votes");
  if (pollsError) throw new Error(pollsError.message);
  

  const { data: demographics, error: demoError } = await supabase
    .from("user_profile")
    .select("age, gender, location, education, occupation");
  if (demoError) throw new Error(demoError.message);
  

  return { polls, demographics };
};

const AdminAnalytics = () => {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState("all");
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalyticsData });

  useEffect(() => {
    queryClient.invalidateQueries(["analytics"]);
  }, [queryClient]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  }

  if (!data.polls.length) {
    return <div className="text-center py-12 text-gray-500">No data available. Create polls to view analytics.</div>;
  }

  const pollVotesData = data.polls.map(poll => ({
    name: poll.poll_title.length > 30 ? poll.poll_title.substring(0, 30) + '...' : poll.poll_title,
    votes: poll.total_votes,
  }));

  const engagementData = data.polls.map(poll => {
    const date = new Date(poll.created_at || new Date()); // Fallback to current date if undefined
    const month = date.toLocaleString('default', { month: 'short' });
    return { date: month, votes: poll.total_votes };
  }).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) existing.votes += curr.votes;
    else acc.push(curr);
    return acc;
  }, [] as { date: string; votes: number }[]);

  const COLORS = ['#6E59A5', '#9B87F5', '#1EAEDB', '#4CAF50', '#FFC107', '#FF5722'];

  // Simple demographic pie chart (e.g., gender distribution)
  const genderData = data.demographics.reduce((acc, user) => {
    const gender = user.gender || 'Unknown';
    const existing = acc.find(item => item.name === gender);
    if (existing) existing.value += 1;
    else acc.push({ name: gender, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleExportCsv = () => {
    if (!data) return;

    const pollsCsv = [
      ["Poll ID", "Poll Title", "Total Votes"].join(","),
      ...data.polls.map(p => `"${p.poll_id}","${p.poll_title.replace(/"/g, '""')}","${p.total_votes}"`)
    ].join("\n");

    const demographicsCsv = [
      ["Age", "Gender", "Location", "Education", "Occupation"].join(","),
      ...data.demographics.map(d => `"${d.age || ""}","${d.gender || ""}","${d.location || ""}","${d.education || ""}","${d.occupation || ""}"`)
    ].join("\n");

    const combinedCsv = `Polls Data:\n${pollsCsv}\n\nDemographics Data:\n${demographicsCsv}`;

    const blob = new Blob([combinedCsv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "analytics_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportJson = () => {
    if (!data) return;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "analytics_data.json");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGeneratePdf = () => {
    alert("PDF generation is not yet implemented.");
    // This would typically involve a more complex library or server-sided rendering
  };

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
            </div>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demographics Overview</CardTitle>
                <CardDescription>
                  Analysis of user demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
            <Button variant="outline" onClick={handleExportCsv}>
              Export as CSV
            </Button>
            <Button variant="outline" onClick={handleExportJson}>
              Export as JSON
            </Button>
            <Button variant="outline" onClick={handleGeneratePdf}>
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
