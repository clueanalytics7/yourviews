import React, { useState, useMemo } from "react";
import TopicList from "@/components/topics/TopicList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Topic } from "@/types";

const fetchTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase.from("topics").select("*", { count: "exact" });

  if (error) {
    throw new Error(error.message);
  }
  // @ts-ignore
  return data;
};

const TopicsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: topics, isLoading, isError, error } = useQuery<Topic[]>({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const categories = useMemo(() => {
    if (!topics) return ["all"];
    return ["all", ...Array.from(new Set(topics.map(topic => topic.category)))];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    return topics.filter((topic) => {
      const matchesSearch = 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [topics, searchTerm, selectedCategory]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Topics</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore a variety of social issues and topics. Vote on polls and see what others think.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search topics..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-60">
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading || isError}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-800 mb-2">Error loading topics</h3>
            <p className="text-red-600">{error.message}</p>
          </div>
        ) : filteredTopics.length > 0 ? (
          <TopicList topics={filteredTopics} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No topics found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
            <Button 
              variant="outline" 
              className="border-brand-purple text-brand-purple"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;