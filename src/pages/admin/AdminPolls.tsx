
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPolls, mockTopics } from "@/data/mockData";
import { Poll } from "@/types";
import { Search, Edit, Trash2, Plus } from "lucide-react";

const AdminPolls = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Map topic IDs to names for display
  const topicMap = mockTopics.reduce((acc, topic) => {
    acc[topic.id] = topic.title;
    return acc;
  }, {} as Record<string, string>);
  
  // Filter polls based on search
  const filteredPolls = mockPolls.filter((poll) => 
    poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topicMap[poll.topicId] && topicMap[poll.topicId].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Polls</h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage polls across different topics
          </p>
        </div>
        
        <Button className="bg-brand-purple hover:bg-brand-light-purple">
          <Plus className="mr-2 h-4 w-4" />
          Create New Poll
        </Button>
      </div>
      
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
                {filteredPolls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {poll.question}
                    </TableCell>
                    <TableCell>{topicMap[poll.topicId] || "Unknown"}</TableCell>
                    <TableCell className="text-center">{poll.totalVotes}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {poll.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(poll.createdAt).toLocaleDateString()}
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
                
                {filteredPolls.length === 0 && (
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
