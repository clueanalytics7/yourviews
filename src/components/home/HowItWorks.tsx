
import React from "react";
import { Vote, FileQuestion, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileQuestion className="h-10 w-10 text-brand-purple" />,
      title: "Browse Topics",
      description: "Explore a variety of social issues and topics that matter to you and society."
    },
    {
      icon: <Vote className="h-10 w-10 text-brand-purple" />,
      title: "Cast Your Vote",
      description: "Share your opinion by voting on polls and see immediate results."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-brand-purple" />,
      title: "Analyze Results",
      description: "Discover trends and patterns in how different demographics view social issues."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">How YourViews Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A simple process to share your opinion and understand what others think about important social issues.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-brand-light-purple bg-opacity-10 p-4">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
