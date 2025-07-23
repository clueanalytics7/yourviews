import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Poll } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import CreatePollForm from "@/components/polls/CreatePollForm";

const fetchPolls = async (): Promise<Poll[]> => {
  const { data: pollItems, error: pollItemsError } = await supabase
    .from("poll_item")
    .select("poll_id, poll_title, poll_description, created_by_id, created_at, updated_at, is_active");

  if (pollItemsError) throw new Error(pollItemsError.message);

  const pollIds = pollItems.map(poll => poll.poll_id);

  const { data: voteSummaries, error: voteSummariesError } = await supabase
    .from("poll_vote_summary")
    .select("poll_id, total_votes")
    .in("poll_id", pollIds);

  if (voteSummariesError) throw new Error(voteSummariesError.message);

  const pollsWithVotes = pollItems.map(poll => ({
    ...poll,
    total_votes: voteSummaries?.find(summary => summary.poll_id === poll.poll_id)?.total_votes ?? 0,
    topicName: "N/A" // No topic table; use a placeholder
  }));

  
  return pollsWithVotes;
};

const AdminPolls = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePollOpen, setCreatePollOpen] = useState(false);
  const { data: polls, isLoading, isError, error } = useQuery<Poll[]>({ 
    queryKey: ["polls"], 
    queryFn: fetchPolls 
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["polls"] });
  }, [queryClient]);

  const filteredPolls = polls?.filter((poll) =>
    poll.poll_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPolls = () => {
    if (!filteredPolls || filteredPolls.length === 0) {
      alert("No polls to download.");
      return;
    }

    const headers = ["Poll ID", "Title", "Description", "Created By", "Created At", "Updated At", "Is Active", "Total Votes"];
    const csv = [
      headers.join(","),
      ...filteredPolls.map(poll =>
        [
          `"${poll.poll_id}"`,
          `"${poll.poll_title.replace(/"/g, '""')}"`,
          `"${(poll.poll_description || "").replace(/"/g, '""')}"`,
          `"${poll.created_by_id}"`,
          `"${new Date(poll.created_at).toISOString()}"`,
          `"${poll.updated_at ? new Date(poll.updated_at).toISOString() : ""}"`,
          `"${poll.is_active}"`,
          `"${poll.total_votes}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "polls_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Polls</h1>
        <p className="text-gray-600 mt-1">
          Create, edit, and manage polls across different topics
        </p>
      </div>
      <div className="flex gap-4">
        <Dialog open={isCreatePollOpen} onOpenChange={setCreatePollOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-light-purple">
              <Plus className="mr-2 h-4 w-4" />
              Create New Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Poll</DialogTitle>
            </DialogHeader>
            <CreatePollForm setOpen={setCreatePollOpen} />
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
          onClick={handleDownloadPolls}
          disabled={!polls?.length}
        >
          Download Polls Data
        </Button>
      </div>
    </div>
  );

  if (!polls?.length) {
    return (
      <div>
        {renderHeader()}
        <div className="text-center py-12 text-gray-500">
          No polls available. Create a new poll to get started.
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderHeader()}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Polls</CardTitle>
          <CardDescription>
            A complete list of all polls in your YourViews platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search polls..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-center">Total Votes</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolls?.map((poll) => (
                  <TableRow key={poll.poll_id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {poll.poll_title}
                    </TableCell>
                    <TableCell>{poll.topicName}</TableCell>
                    <TableCell className="text-center">{poll.total_votes}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poll.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {poll.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(poll.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredPolls?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No polls found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPolls;
