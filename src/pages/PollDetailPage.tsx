import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users } from "lucide-react";
import PollCard from "@/components/polls/PollCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Poll } from "@/types";
import PollDetailSkeleton from "@/components/polls/PollDetailSkeleton";

const fetchPoll = async (id: string): Promise<Poll> => {
  const { data, error } = await supabase
    .from("poll_item")
    .select("*, options:poll_option(*)")
    .eq("poll_id", id)
    .single();
  if (error) throw new Error(error.message);
  // Transform snake_case to camelCase to match Poll interface
  const transformedData: Poll = {
    ...data,
    options: data.options.map((option: PollOption) => ({
      ...option,
      vote_count: option.vote_count,
    })),
  };
  return transformedData;
};

const PollDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { 
    data: poll, 
    isLoading: pollLoading, 
  } = useQuery<Poll>({
    queryKey: ["poll", id],
    queryFn: () => fetchPoll(id!),
    enabled: !!id,
  });

  if (pollLoading) {
    return <PollDetailSkeleton />;
  }

  if (!poll) {
    return (
      <div className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Poll Not Found</h2>
        <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <Link to="/polls">
          <Button className="bg-brand-purple hover:bg-brand-light-purple">
            Browse All Polls
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/polls" className="text-brand-purple hover:text-brand-light-purple flex items-center">
            ← Back to Polls
          </Link>
        </div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4">{poll.poll_title}</h1>
          <p className="text-gray-600 mb-6">{poll.poll_description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Created on {new Date(poll.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{poll.total_votes} total votes</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Vote in this Poll</h2>
          <PollCard poll={poll} />
        </div>
      </div>
    </div>
  );
};

export default PollDetailPage;