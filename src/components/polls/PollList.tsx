
import React from "react";
import PollCard from "./PollCard";
import { Poll } from "@/types";

interface PollListProps {
  polls: Poll[];
}

const PollList: React.FC<PollListProps> = ({ polls }) => {
  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard key={poll.poll_id} poll={poll} />
      ))}
    </div>
  );
};

export default PollList;
