
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto py-16 md:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                <span className="block title-gradient">Your Opinion Matters</span>
                <span className="block text-gray-900">Shape the Conversation</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl text-gray-600">
                Join YourViews to vote on important social issues and see what others think. Your voice can make a difference.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link to="/topics">
                  <Button className="bg-brand-purple hover:bg-brand-light-purple text-white text-base px-8 py-6">
                    Explore Topics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="bg-white text-brand-purple border-brand-purple hover:bg-brand-purple hover:text-white text-base px-8 py-6">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="500" height="500" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M136.1,-157.7C173.1,-126.9,198.2,-80.5,209.4,-28.5C220.6,23.5,217.9,81.1,190.2,124.1C162.5,167.2,109.8,195.8,55.4,204.8C1,213.8,-55.1,203.3,-98.1,174.8C-141.1,146.2,-171,99.8,-189.9,44.5C-208.8,-10.9,-216.7,-75.2,-193,-121.8C-169.3,-168.4,-114.2,-197.2,-64.3,-206.5C-14.5,-215.7,30.1,-205.3,74.6,-198.8C119.1,-192.4,165.5,-189.9,188.8,-166.9C212.1,-143.9,186.1,-100.5,167.3,-70.2Z" fill="#6E59A5" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-10">
        <svg width="500" height="500" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M146.7,-196.3C191.9,-172.8,230.9,-133.3,251.3,-84.7C271.7,-36,273.4,21.9,253.6,67.1C233.9,112.3,192.7,144.9,147.6,177.1C102.4,209.3,53.3,241.2,3.7,236.7C-45.9,232.2,-95.5,191.2,-141.4,151.4C-187.3,111.5,-229.5,72.7,-242.8,24.7C-256.1,-23.2,-240.5,-80.3,-207.1,-124.4C-173.8,-168.5,-122.5,-199.6,-74.3,-221.3C-26,-243,-13,-255.5,18.9,-280.3C50.8,-305.1,101.5,-342.2,137.8,-324.2C174.1,-306.2,196,-287,190.5,-248.3C185,-209.6,152.1,-151.2,146.7,-196.3Z" fill="#1EAEDB" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
