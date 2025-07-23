
import React from 'react';
import { Poll, UserVote, Comment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserActivityProps {
  createdPolls: Poll[];
  votedPolls: UserVote[];
  comments: Comment[];
}

const UserActivity: React.FC<UserActivityProps> = ({ createdPolls, votedPolls, comments }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Polls You've Created</CardTitle>
        </CardHeader>
        <CardContent>
          {createdPolls.length > 0 ? (
            <ul className="space-y-2">
              {createdPolls.map((poll) => (
                <li key={poll.poll_id} className="p-2 border rounded-md">
                  {poll.poll_title}
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't created any polls yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Polls You've Voted On</CardTitle>
        </CardHeader>
        <CardContent>
          {votedPolls.length > 0 ? (
            <ul className="space-y-2">
              {votedPolls.map((vote) => (
                <li key={vote.vote_id} className="p-2 border rounded-md">
                  You voted on a poll.
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't voted on any polls yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.comment_id} className="p-2 border rounded-md">
                  {comment.comment_text}
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't made any comments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;
