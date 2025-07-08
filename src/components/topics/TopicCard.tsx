
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={topic.imageUrl || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=60"}
          alt={topic.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-brand-purple">
          {topic.category}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{topic.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{topic.description}</p>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-600">
          <FileQuestion className="h-4 w-4 mr-1" />
          <span>{topic.pollCount} polls</span>
        </div>
        <Link 
          to={`/topics/${topic.id}`}
          className="text-brand-purple hover:text-brand-light-purple font-medium"
        >
          View Topic
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TopicCard;
