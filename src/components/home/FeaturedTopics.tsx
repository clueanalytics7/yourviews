
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopicList from "@/components/topics/TopicList";
import { Topic } from "@/types";

interface FeaturedTopicsProps {
  topics: Topic[];
}

const FeaturedTopics: React.FC<FeaturedTopicsProps> = ({ topics }) => {
  return (
    <section className="py-16 bg-brand-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Topics</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore these important social topics and share your opinion. See what others think and join the conversation.
          </p>
        </div>
        
        <TopicList topics={topics.slice(0, 3)} />
        
        <div className="mt-12 text-center">
          <Link to="/topics">
            <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
              View All Topics
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTopics;
