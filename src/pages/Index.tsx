import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PollCard from "@/components/polls/PollCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Poll } from "@/types";
import PollCardSkeleton from "@/components/polls/PollCardSkeleton";
import PollList from "@/components/polls/PollList";



const fetchRecentPolls = async (): Promise<Poll[]> => {
  const {
    data: pollData,
    error: pollError,
    status,
    statusText,
  } = await supabase
    .from("poll_item")
    .select("*, user_profile(user_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  if (pollError) {
    throw new Error(pollError.message);
  }

  if (!pollData || pollData.length === 0) {
    return [];
  }

  const pollIds = pollData.map((poll) => poll.poll_id);

  const { data: optionsData, error: optionsError } = await supabase
    .from("poll_option")
    .select("option_id, poll_id, option_text")
    .in("poll_id", pollIds);

  if (optionsError) {
    throw new Error(optionsError.message);
  }

  const { data: summaryData, error: summaryError } = await supabase
    .from("poll_vote_summary")
    .select("poll_id, total_votes")
    .in("poll_id", pollIds);

  if (summaryError) {
    throw new Error(summaryError.message);
  }

  const pollsWithVotes = pollData.map((poll) => {
    const options = optionsData.filter((option) => option.poll_id === poll.poll_id);
    const votes = summaryData.filter((summary) => summary.poll_id === poll.poll_id);

    const optionsWithVotes = options.map((option) => ({
      ...option,
      votes: votes.find((v) => v.option_id === option.option_id)?.vote_count || 0,
    }));

    return {
      ...poll,
      options: optionsWithVotes,
    };
  });

  return pollsWithVotes;
};



const fetchFeaturedPoll = async (): Promise<Poll | null> => {
  const { data: summaryData, error: summaryError } = await supabase
    .from("poll_vote_summary")
    .select("poll_id, total_votes")
    .order("total_votes", { ascending: false })
    .limit(1)
    .single();

  if (summaryError) {
    throw new Error(summaryError.message);
  }

  if (!summaryData) {
    return null;
  }

  const { data: pollData, error: pollError } = await supabase
    .from("poll_item")
    .select("*, user_profile(user_name)")
    .eq("poll_id", summaryData.poll_id)
    .single();

  if (pollError) {
    throw new Error(pollError.message);
  }

  if (!pollData) {
    return null;
  }

  const { data: optionsData, error: optionsError } = await supabase
    .from("poll_option")
    .select("option_id, poll_id, option_text, vote_count")
    .eq("poll_id", pollData.poll_id);

  if (optionsError) {
    throw new Error(optionsError.message);
  }

  return {
    ...pollData,
    options: optionsData,
    total_votes: summaryData.total_votes,
  };
};

const Index = () => {
  const { 
    data: recentPolls, 
    isLoading: pollsLoading, 
    error: pollsError,
  } = useQuery<Poll[]>({ queryKey: ["recentPolls"], queryFn: fetchRecentPolls });

  const { 
    data: featuredPoll, 
    isLoading: featuredPollLoading,
    error: featuredPollError,
  } = useQuery<Poll>({ queryKey: ["featuredPoll"], queryFn: fetchFeaturedPoll });

  
  

  return (
    <div>
      <Hero />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Recent Polls</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the latest polls and cast your vote.
            </p>
          </div>
          {pollsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PollCardSkeleton />
              <PollCardSkeleton />
              <PollCardSkeleton />
            </div>
          ) : pollsError ? (
            <div className="text-center text-red-600">
              Error loading recent polls: {pollsError.message}
            </div>
          ) : recentPolls && recentPolls.length > 0 ? (
            <PollList polls={recentPolls} />
          ) : (
            <div className="text-center">No recent polls available</div>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Poll</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cast your vote on this featured poll and see what others think.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {featuredPollLoading ? (
              <PollCardSkeleton />
            ) : featuredPollError ? (
              <div className="text-center text-red-600">
                Error loading featured poll: {featuredPollError.message}
              </div>
            ) : featuredPoll ? (
              <PollCard poll={featuredPoll} />
            ) : (
              <div className="text-center">No featured poll available</div>
            )}
          </div>
        </div>
      </section>
      
      <HowItWorks />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to share your views?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join YourViews today and start sharing your opinion on important social issues.
            Your voice matters in shaping the conversation.
          </p>
          <div className="inline-block bg-brand-purple hover:bg-brand-light-purple text-white font-medium py-3 px-8 rounded-md transition-colors">
            <a href="/register">Create Your Account</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
