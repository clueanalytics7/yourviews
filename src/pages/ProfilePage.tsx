
import React, { useState } from "react";
import ProfileForm from "@/components/user/ProfileForm";
import { mockUsers } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  // In real app, this would come from authentication context
  const [user, setUser] = useState(mockUsers[1]);
  
  const handleProfileUpdate = (data: any) => {
    // Convert age to number if provided
    if (data.age) {
      data.age = parseInt(data.age);
    }
    
    // Update user profile
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...data
      }
    };
    
    setUser(updatedUser);
    
    // Show success message
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-600">
              Manage your account settings and demographic information
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                  <CardDescription>
                    This information helps us analyze opinion trends across demographics.
                    All data is anonymous and only used for aggregate analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm profile={user.profile} onSave={handleProfileUpdate} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Basic Details</h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                              {user.username}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                        >
                          Edit Account Information
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                      <div className="mt-4">
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>
                    View your recent votes and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">
                      Your activity will appear here after you start voting on polls.
                    </p>
                    <Button 
                      className="bg-brand-purple hover:bg-brand-light-purple"
                      onClick={() => window.location.href = "/topics"}
                    >
                      Browse Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
