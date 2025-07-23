export interface User {
  id: string;
  user_name: string;
  email: string;
  is_admin: boolean;
  profile?: UserProfile;
}


export interface UserProfile {
  user_id: string;
  user_name: string;
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
  age?: number;
  gender?: string;
  location?: string;
  education?: string;
  occupation?: string;
}

export interface PollOption {
  option_id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

export interface Poll {
  poll_id: string;
  poll_title: string;
  poll_description?: string;
  created_by_id: string;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
  options: PollOption[];
  total_votes: number;
}

export interface Comment {
  comment_id: string;
  poll_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at?: string;
}

export interface UserVote {
  vote_id: string;
  user_id: string;
  poll_id: string;
  option_id: string;
  voted_at: string;
}







