
import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import HowItWorks from "@/components/home/HowItWorks";
import PollCard from "@/components/polls/PollCard";
import { mockTopics, mockPolls } from "@/data/mockData";

const Index = () => {
  // Get the most popular poll for the featured section
  const featuredPoll = mockPolls[0];

  return (
    <div>
      <Hero />
      
      <FeaturedTopics topics={mockTopics} />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Poll</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cast your vote on this featured poll and see what others think.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <PollCard poll={featuredPoll} />
          </div>
        </div>
      </section>
      
      <HowItWorks />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to share your views?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join YourViews today and start sharing your opinion on important social issues.
            Your voice matters in shaping the conversation.
          </p>
          <div className="inline-block bg-brand-purple hover:bg-brand-light-purple text-white font-medium py-3 px-8 rounded-md transition-colors">
            <a href="/register">Create Your Account</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
