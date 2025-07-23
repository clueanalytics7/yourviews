
import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/user/ProfileForm";
import EditProfileForm from "@/components/user/EditProfileForm";
import UserActivity from "@/components/user/UserActivity";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Poll, UserVote, Comment } from "@/types";

const ProfilePage = () => {
  const { user: authUser, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userActivity, setUserActivity] = useState<{
    createdPolls: Poll[];
    votedPolls: UserVote[];
    comments: Comment[];
  }>({ createdPolls: [], votedPolls: [], comments: [] });

  useEffect(() => {
    const fetchProfile = async () => {
      if (authUser) {
        try {
          const queryPromise = supabase
            .from("user_profile")
            .select("*")
            .eq("user_id", authUser.id)
            .single();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("user_profile query timed out after 30s")), 30000)
          );
          const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
          if (error) throw error;
          setProfile(data);
        } catch (error: unknown) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error fetching profile",
            description: "Could not load your profile data.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchUserActivity = async () => {
      if (authUser) {
        try {
          const { data: createdPolls, error: pollsError } = await supabase
            .from("poll_item")
            .select("*")
            .eq("created_by_id", authUser.id);
          if (pollsError) throw pollsError;

          const { data: votedPolls, error: votesError } = await supabase
            .from("user_vote")
            .select("*")
            .eq("user_id", authUser.id);
          if (votesError) throw votesError;

          const { data: comments, error: commentsError } = await supabase
            .from("comment_item")
            .select("*")
            .eq("user_id", authUser.id);
          if (commentsError) throw commentsError;

          setUserActivity({
            createdPolls: createdPolls || [],
            votedPolls: votedPolls || [],
            comments: comments || [],
          });
        } catch (error) {
          console.error("Error fetching user activity:", error);
          toast({
            variant: "destructive",
            title: "Error fetching activity",
            description: "Could not load your activity data.",
          });
        }
      }
    };

    fetchProfile();
    fetchUserActivity();
  }, [authUser]);

  const handleProfileUpdate = async (data: unknown) => {
    if (!authUser || !profile) return;

    try {
      setIsLoading(true);
      const updateData = {
        ...profile,
        ...data,
        updated_at: new Date().toISOString(),
      };
      const { data: updatedProfile, error } = await supabase
        .from("user_profile")
        .update(updateData)
        .eq("user_id", authUser.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          (error as { message?: string })?.message ||
          "Could not update your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountUpdate = async (data: { user_name: string }) => {
    if (!authUser) return;

    try {
      setIsLoading(true);
      const { data: updatedProfile, error } = await supabase
        .from("user_profile")
        .update({ user_name: data.user_name, updated_at: new Date().toISOString() })
        .eq("user_id", authUser.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);
      setIsEditModalOpen(false);
      toast({
        title: "Account updated",
        description: "Your username has been updated successfully.",
      });
    } catch (error: unknown) {
      console.error("Error updating account:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          (error as { message?: string })?.message ||
          "Could not update your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;

    try {
      // This RPC function needs to be created in your Supabase project.
      // It should handle deleting the user's data from all related tables
      // and then deleting the user from auth.users.
      // This RPC function needs to be created in your Supabase project.
      // It should handle deleting the user's data from all related tables
      // and then deleting the user from auth.users.
      const { error } = await supabase.rpc('delete_user_account');

      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      signOut();
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description:
          (error as { message?: string })?.message ||
          "Could not delete your account.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">Could not load profile.</div>;
  }

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
                    This information helps us analyze opinion trends across
                    demographics. All data is anonymous and only used for
                    aggregate analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm
                    profile={profile}
                    onSave={handleProfileUpdate}
                  />
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
                            <label className="block text-sm font-medium text-gray-700">
                              Username
                            </label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                              {profile.user_name}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                              {authUser.email}
                            </div>
                          </div>
                        </div>
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                            >
                              Edit Account Information
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Account</DialogTitle>
                              <DialogDescription>
                                Update your username below.
                              </DialogDescription>
                            </DialogHeader>
                            <EditProfileForm
                              profile={profile}
                              onSave={handleAccountUpdate}
                              onCancel={() => setIsEditModalOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-red-600">
                        Danger Zone
                      </h3>
                      <div className="mt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <UserActivity {...userActivity} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

