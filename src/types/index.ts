
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  gender?: string;
  location?: string;
  education?: string;
  occupation?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
  pollCount: number;
}

export interface Poll {
  id: string;
  topicId: string;
  question: string;
  description?: string;
  options: PollOption[];
  createdAt: string;
  isActive: boolean;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  pollId: string;
  userId: string;
  text: string;
  createdAt: string;
  username: string;
}
