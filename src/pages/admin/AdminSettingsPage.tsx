import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const AdminSettingsPage = () => {
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };

  const jsonToCsv = (jsonArray: unknown[], filename: string) => {
    if (!jsonArray || jsonArray.length === 0) {
      console.warn("No data to export.");
      toast({
        title: "No Data",
        description: "There is no data to export.",
        variant: "destructive",
      });
      return;
    }

    const replacer = (key: string, value: unknown) => (value === null ? "" : value);
    const header = Object.keys(jsonArray[0]);
    const csv = [
      header.join(","), // header row first
      ...jsonArray.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Export Successful",
        description: `Data exported to ${filename}`,
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Your browser does not support downloading files.",
        variant: "destructive",
      });
    }
  };

  const exportAllData = async () => {
    try {
      toast({
        title: "Exporting Data",
        description: "Please wait while your data is being prepared...",
      });

      // Fetch users
      const queryPromise = supabase
        .from("user_profile")
        .select("*");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("user_profile query timed out after 30s")), 30000)
      );
      const { data: users, error: usersError } = await Promise.race([queryPromise, timeoutPromise]);
      if (usersError) throw usersError;
      jsonToCsv(users, "users_export.csv");

      // Fetch polls
      const { data: polls, error: pollsError } = await supabase
        .from("poll_item")
        .select("*");
      if (pollsError) throw pollsError;
      jsonToCsv(polls, "polls_export.csv");

      // Fetch poll options
      const { data: pollOptions, error: pollOptionsError } = await supabase
        .from("poll_option")
        .select("*");
      if (pollOptionsError) throw pollOptionsError;
      jsonToCsv(pollOptions, "poll_options_export.csv");

      // Fetch poll votes
      const { data: pollVotes, error: pollVotesError } = await supabase
        .from("user_vote")
        .select("*");
      if (pollVotesError) throw pollVotesError;
      jsonToCsv(pollVotes, "poll_votes_export.csv");

      toast({
        title: "Export Complete",
        description: "All selected data has been exported.",
      });
    } catch (error: unknown) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: `Failed to export data: ${error.message || error.toString()}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage general settings for your YourViews platform
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic site information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="YourViews" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                defaultValue="YourViews is a platform for creating and participating in polls."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" defaultValue="contact@yourviews.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Settings related to user accounts and registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="allowRegistration" defaultChecked />
              <Label htmlFor="allowRegistration">Allow New User Registrations</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultUserRole">Default User Role</Label>
              <Input id="defaultUserRole" defaultValue="User" disabled />
              <p className="text-sm text-gray-500">
                (Advanced: Role management can be expanded here)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Poll Settings</CardTitle>
            <CardDescription>Configure default behaviors for polls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPollDuration">Default Poll Duration (days)</Label>
              <Input id="defaultPollDuration" type="number" defaultValue={7} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="allowAnonymousVoting" />
              <Label htmlFor="allowAnonymousVoting">Allow Anonymous Voting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="requireEmailVerification" defaultChecked />
              <Label htmlFor="requireEmailVerification">Require Email Verification for Voting</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Options for managing platform data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="destructive" onClick={() => toast({ title: "Feature Coming Soon", description: "Clearing old polls is not yet implemented." })}>
              Clear Inactive Polls
            </Button>
            <p className="text-sm text-gray-500">
              (This action cannot be undone. Consider backing up data first.)
            </p>
            <Button variant="outline" onClick={exportAllData}>
              Export All Data
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-brand-purple hover:bg-brand-light-purple" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
