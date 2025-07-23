import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";

import { Poll } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: topicId } = useParams<{ id: string }>();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: hasUserVoted } = useQuery({
    queryKey: ["hasVoted", poll.poll_id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { count } = await supabase
        .from("user_vote")
        .select("vote_id", { count: "exact" })
        .eq("poll_id", poll.poll_id)
        .eq("user_id", user.id);
      return count! > 0;
    },
    enabled: !!user,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ poll_id, option_id, user_id }: { poll_id: string; option_id: string; user_id: string }) => {
      const { error: voteError } = await supabase.from("user_vote").upsert([
        { poll_id, user_id, option_id },
      ]);

      if (voteError) throw voteError;

      const { error: optionError } = await supabase
        .from("poll_option")
        .update({ vote_count: () => "vote_count + 1" })
        .eq("option_id", option_id);

      if (optionError) throw optionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls", topicId] });
      queryClient.invalidateQueries({ queryKey: ["hasVoted", poll.poll_id, user?.id] });
      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit vote",
        description: error.message,
      });
    },
  });

  const handleVote = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please log in to cast your vote.",
      });
      return;
    }
    if (!selectedOption) return;

    voteMutation.mutate({
      poll_id: poll.poll_id,
      option_id: selectedOption,
      user_id: user.id,
    });
  };

  // Calculate the percentage for each option
  const totalVotes = poll.options.reduce((acc, option) => acc + option.vote_count, 0);

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const showResults = hasUserVoted || voteMutation.isSuccess;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{poll.poll_title}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{format(new Date(poll.created_at), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{poll.total_votes} votes</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {poll.poll_description && (
          <p className="text-gray-600 mb-4 text-sm">{poll.poll_description}</p>
        )}
        
        {showResults ? (
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = getPercentage(option.vote_count);
              const isSelected = selectedOption === option.option_id; // This will only be true if they just voted
              
              return (
                <div key={option.option_id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className={isSelected ? "font-medium text-brand-purple" : "font-medium"}>
                      {option.option_text}
                    </Label>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={isSelected ? "bg-gray-200" : "bg-gray-100"}
                    indicatorClassName={isSelected ? "bg-brand-purple" : "bg-brand-light-purple bg-opacity-60"}
                  />
                  <div className="text-xs text-gray-500 pl-1">
                    {option.vote_count} votes
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-2">
            {poll.options.map((option) => (
              <div key={option.option_id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.option_id} id={option.option_id} />
                <Label htmlFor={option.option_id} className="cursor-pointer flex-grow">
                  {option.option_text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {showResults ? (
          <p className="text-sm text-brand-purple">Thanks for your vote!</p>
        ) : (
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption || voteMutation.isPending || !user || hasUserVoted}
            className="bg-brand-purple hover:bg-brand-light-purple"
          >
            {voteMutation.isPending ? "Submitting..." : "Vote Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;