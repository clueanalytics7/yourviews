import { useState, useMemo } from "react";
import PollList from "@/components/polls/PollList";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Poll } from "@/types";
import PollCardSkeleton from "@/components/polls/PollCardSkeleton";



const fetchPolls = async (): Promise<Poll[]> => {
  const { data, error } = await supabase
    .from("poll_item")
    .select("*, user_profile(user_name), options:poll_option(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  const pollsWithTotalVotes: Poll[] = data.map((poll) => {
    const totalVotes = poll.options.reduce((sum: number, option: { vote_count: number; }) => sum + option.vote_count, 0);
    return {
      ...poll,
      total_votes: totalVotes,
    };
  });

  return pollsWithTotalVotes;
};

const PollsPage: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "most_voted">(
    "newest"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: polls,
    isLoading,
    error,
  } = useQuery<Poll[], Error>({
    queryKey: ["polls"],
    queryFn: fetchPolls,
  });

  const sortedPolls = useMemo(() => {
    if (!polls) return [];
    const sorted = [...polls];
    if (sortOrder === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOrder === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOrder === "most_voted") {
      sorted.sort((a, b) => {
        const totalVotesA = a.options.reduce((sum, option) => sum + option.vote_count, 0);
        const totalVotesB = b.options.reduce((sum, option) => sum + option.vote_count, 0);
        return totalVotesB - totalVotesA;
      });
    }
    return sorted;
  }, [polls, sortOrder]);

  const filteredPolls = useMemo(() => {
    if (!sortedPolls) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = sortedPolls.filter(
      (poll) =>
        poll.poll_title.toLowerCase().includes(lowerCaseSearchTerm) ||
        poll.poll_description.toLowerCase().includes(lowerCaseSearchTerm) ||
        poll.user_profile?.user_name
          ?.toLowerCase()
          .includes(lowerCaseSearchTerm)
    );
    return filtered;
  }, [sortedPolls, searchTerm]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Polls</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PollCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading polls: {error.message}
      </div>
    );
  }

  if (!polls) {
    return (
      <div className="container mx-auto p-4">
        <p>No polls available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Polls</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <Input
          type="text"
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value: "newest" | "oldest" | "most_voted") =>
            setSortOrder(value)
          }
          value={sortOrder}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most_voted">Most Voted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PollList polls={filteredPolls} />
    </div>
  );
};

export default PollsPage;