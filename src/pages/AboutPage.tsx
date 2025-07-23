
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About YourViews</h1>
            <p className="text-xl text-gray-600">
              Collecting and analyzing opinions on social issues that matter
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  YourViews is dedicated to creating a platform where diverse opinions on important social issues can be shared, analyzed, and understood. We believe that by collecting and visualizing public sentiment, we can help bridge divides and foster more informed dialogue.
                </p>
                <p className="text-gray-600">
                  We're committed to providing a space where every voice can be heard and where data is presented in a clear, unbiased way to help people understand different perspectives.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                  alt="People discussing issues"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <p className="text-gray-600 mb-4">
                  Our platform enables users to vote on polls related to various social issues. We collect optional demographic information to help analyze how opinions may vary across different groups.
                </p>
                <p className="text-gray-600">
                  The data is visualized in real-time, allowing users to see how their views compare with others. Our analytics tools help identify trends and patterns in public opinion.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80"
                  alt="Data analysis visualization"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <Card className="bg-brand-purple bg-opacity-5 border-brand-purple">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="mb-3 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand-purple bg-opacity-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Transparency</h3>
                    <p className="text-gray-600 text-sm">
                      We present data clearly and honestly, without manipulation or bias.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand-purple bg-opacity-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Inclusivity</h3>
                    <p className="text-gray-600 text-sm">
                      We welcome diverse perspectives and ensure all voices can be heard.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand-purple bg-opacity-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                    <p className="text-gray-600 text-sm">
                      We protect user data and only use demographic information for aggregate analysis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-6">Ready to Share Your Views?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button className="bg-brand-purple hover:bg-brand-light-purple">
                    Create an Account
                  </Button>
                </Link>
                <Link to="/polls">
                  <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                    Browse Topics
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
