import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Loader2, AlertTriangle } from "lucide-react";
import PollList from "@/components/polls/PollList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Topic, Poll } from "@/types";

const fetchTopic = async (id: string): Promise<Topic> => {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const fetchPolls = async (topicId: string): Promise<Poll[]> => {
  const { data, error } = await supabase
    .from("polls")
    .select("*, options(*)")
    .eq("topicId", topicId);

  if (error) {
    throw new Error(error.message);
  }
  // @ts-ignore
  return data;
};

const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { 
    data: topic, 
    isLoading: topicLoading, 
    isError: topicError, 
    error: topicErrorMessage 
  } = useQuery<Topic>({
    queryKey: ["topic", id],
    queryFn: () => fetchTopic(id!),
    enabled: !!id,
  });

  const { 
    data: polls, 
    isLoading: pollsLoading, 
    isError: pollsError, 
    error: pollsErrorMessage 
  } = useQuery<Poll[]>({
    queryKey: ["polls", id],
    queryFn: () => fetchPolls(id!),
    enabled: !!id,
  });

  if (topicLoading || pollsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (topicError || pollsError) {
    return (
      <div className="py-16 container mx-auto px-4 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Error loading page</h2>
        <p className="text-red-600 mb-6">
          {topicError ? topicErrorMessage?.message : pollsErrorMessage?.message}
        </p>
        <Link to="/topics">
          <Button className="bg-brand-purple hover:bg-brand-light-purple">
            Browse All Topics
          </Button>
        </Link>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Topic Not Found</h2>
        <p className="text-gray-600 mb-6">The topic you're looking for doesn't exist or has been removed.</p>
        <Link to="/topics">
          <Button className="bg-brand-purple hover:bg-brand-light-purple">
            Browse All Topics
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/topics" className="text-brand-purple hover:text-brand-light-purple flex items-center">
            ← Back to Topics
          </Link>
        </div>
        
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={topic.imageUrl || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=60"}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-brand-purple">
                  {topic.category}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>
              <p className="text-gray-600 mb-6">{topic.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>Created on {new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{polls?.reduce((sum, poll) => sum + poll.totalVotes, 0)} total votes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Polls on this Topic</h2>
          
          {polls && polls.length > 0 ? (
            <PollList polls={polls} />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No polls available</h3>
              <p className="text-gray-600">This topic doesn't have any active polls yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;