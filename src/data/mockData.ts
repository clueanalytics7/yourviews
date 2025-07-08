
import { Topic, Poll, User, Comment } from "@/types";

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Climate Change",
    description: "Discussing the impacts and solutions for global climate change",
    category: "Environment",
    createdAt: "2023-10-15",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=60",
    pollCount: 3
  },
  {
    id: "2",
    title: "Education Reform",
    description: "Exploring improvements to education systems worldwide",
    category: "Education",
    createdAt: "2023-10-10",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=60",
    pollCount: 2
  },
  {
    id: "3",
    title: "Healthcare Access",
    description: "Examining barriers to healthcare and potential solutions",
    category: "Health",
    createdAt: "2023-10-05",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=60",
    pollCount: 2
  },
  {
    id: "4",
    title: "Digital Privacy",
    description: "The balance between security and privacy in the digital age",
    category: "Technology",
    createdAt: "2023-09-28",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=60",
    pollCount: 1
  },
  {
    id: "5",
    title: "Economic Inequality",
    description: "Addressing the growing wealth gap and its societal impacts",
    category: "Economy",
    createdAt: "2023-09-20",
    imageUrl: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=60",
    pollCount: 1
  },
];

export const mockPolls: Poll[] = [
  {
    id: "1",
    topicId: "1",
    question: "What do you believe is the most effective way to combat climate change?",
    description: "Climate change is one of the most pressing issues of our time. We want to know what you think is the best approach to address it.",
    options: [
      { id: "1-1", text: "Government regulations on emissions", votes: 243 },
      { id: "1-2", text: "Individual lifestyle changes", votes: 187 },
      { id: "1-3", text: "Corporate responsibility initiatives", votes: 156 },
      { id: "1-4", text: "Technological innovation", votes: 312 }
    ],
    createdAt: "2023-10-15",
    isActive: true,
    totalVotes: 898
  },
  {
    id: "2",
    topicId: "2",
    question: "Which educational reform would have the most positive impact?",
    description: "Education systems around the world are constantly evolving. What change do you think would be most beneficial?",
    options: [
      { id: "2-1", text: "Smaller class sizes", votes: 189 },
      { id: "2-2", text: "Updated curriculum focused on modern skills", votes: 275 },
      { id: "2-3", text: "More funding for teacher salaries", votes: 134 },
      { id: "2-4", text: "Increased access to technology", votes: 157 }
    ],
    createdAt: "2023-10-10",
    isActive: true,
    totalVotes: 755
  },
  {
    id: "3",
    topicId: "3",
    question: "What is the biggest barrier to healthcare access?",
    description: "Many people struggle to access adequate healthcare. What do you think is the primary obstacle?",
    options: [
      { id: "3-1", text: "Cost", votes: 354 },
      { id: "3-2", text: "Location/distance to facilities", votes: 122 },
      { id: "3-3", text: "Insurance complexity", votes: 213 },
      { id: "3-4", text: "Limited availability of specialists", votes: 98 }
    ],
    createdAt: "2023-10-05",
    isActive: true,
    totalVotes: 787
  },
  {
    id: "4",
    topicId: "1",
    question: "Do you think current climate policies are sufficient?",
    options: [
      { id: "4-1", text: "Yes, they're appropriate", votes: 76 },
      { id: "4-2", text: "No, they need to be stronger", votes: 423 },
      { id: "4-3", text: "They're too strict already", votes: 89 }
    ],
    createdAt: "2023-09-28",
    isActive: true,
    totalVotes: 588
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@yourviews.com",
    isAdmin: true,
    profile: {
      age: 35,
      gender: "Prefer not to say",
      location: "New York",
      education: "Masters",
      occupation: "Software Developer"
    }
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    isAdmin: false,
    profile: {
      age: 28,
      gender: "Female",
      location: "San Francisco",
      education: "Bachelors",
      occupation: "Teacher"
    }
  }
];

export const mockComments: Comment[] = [
  {
    id: "1",
    pollId: "1",
    userId: "2",
    text: "I think technological innovation is key, but we need regulations to incentivize it properly.",
    createdAt: "2023-10-16",
    username: "janedoe"
  },
  {
    id: "2",
    pollId: "1",
    userId: "1",
    text: "Individual actions add up, but without corporate accountability we won't see the necessary changes in time.",
    createdAt: "2023-10-16",
    username: "admin"
  },
  {
    id: "3",
    pollId: "2",
    userId: "2",
    text: "As a teacher, I can say that smaller class sizes make a huge difference in student outcomes.",
    createdAt: "2023-10-11",
    username: "janedoe"
  }
];
