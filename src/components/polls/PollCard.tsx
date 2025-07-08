import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, Users } from "lucide-react";
import { Poll } from "@/types";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

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
    queryKey: ["hasVoted", poll.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { count } = await supabase
        .from("votes")
        .select("id", { count: "exact" })
        .eq("poll_id", poll.id)
        .eq("user_id", user.id);
      return count! > 0;
    },
    enabled: !!user,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionId, userId }: { pollId: string; optionId: string; userId: string }) => {
      const { data, error } = await supabase.rpc("vote_on_poll", {
        p_poll_id: pollId,
        p_option_id: optionId,
        p_user_id: userId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls", topicId] });
      queryClient.invalidateQueries({ queryKey: ["hasVoted", poll.id, user?.id] });
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
      pollId: poll.id,
      optionId: selectedOption,
      userId: user.id,
    });
  };

  // Calculate the percentage for each option
  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
  };

  const showResults = hasUserVoted || voteMutation.isSuccess;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{poll.question}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{format(new Date(poll.createdAt), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {poll.description && (
          <p className="text-gray-600 mb-4 text-sm">{poll.description}</p>
        )}
        
        {showResults ? (
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = getPercentage(option.votes);
              const isSelected = selectedOption === option.id; // This will only be true if they just voted
              
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className={isSelected ? "font-medium text-brand-purple" : "font-medium"}>
                      {option.text}
                    </Label>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={isSelected ? "bg-gray-200" : "bg-gray-100"}
                    indicatorClassName={isSelected ? "bg-brand-purple" : "bg-brand-light-purple bg-opacity-60"}
                  />
                  <div className="text-xs text-gray-500 pl-1">
                    {option.votes} votes
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-2">
            {poll.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer flex-grow">
                  {option.text}
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