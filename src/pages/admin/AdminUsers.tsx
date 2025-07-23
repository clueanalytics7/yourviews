import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserCog, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AddUserForm from "@/components/admin/AddUserForm";

const fetchUsers = async (): Promise<User[]> => {
  const queryPromise = supabase
    .from("user_profile")
    .select("user_id, user_name, is_admin, created_at, updated_at");
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("user_profile query timed out after 30s")), 30000)
  );
  const { data: userProfiles, error: userProfileError } = await Promise.race([queryPromise, timeoutPromise]);

  if (userProfileError) throw new Error(userProfileError.message);

  // For now, we'll fetch emails separately or use a placeholder.
  // A more efficient approach would be an RPC function in Supabase.
  const usersWithEmails = await Promise.all(
    userProfiles.map(async (profile) => {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.user_id);
      if (authError) {
        console.error("Error fetching auth user:", authError);
        return { ...profile, email: "N/A" };
      }
      return { ...profile, email: authUser.user.email ?? "N/A" };
    })
  );

  
  return usersWithEmails;
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setAddUserOpen] = useState(false);

  const { data: users, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient]);

  const updateUserRole = useMutation({
    mutationFn: async ({ user_id, is_admin }: { user_id: string; is_admin: boolean }) => {
      const { error } = await supabase.from("user_profile").update({ is_admin }).eq("user_id", user_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: unknown) => {
      toast.error("Error updating role", { description: error instanceof Error ? error.message : "An unknown error occurred" });
    },
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-600 mt-1">
          View and manage user accounts on your platform
        </p>
      </div>
      <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
        <DialogTrigger asChild>
          <Button className="bg-brand-purple hover:bg-brand-light-purple">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a New User</DialogTitle>
          </DialogHeader>
          <AddUserForm setOpen={setAddUserOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );

  if (!users?.length) {
    return (
      <div>
        {renderHeader()}
        <div className="text-center py-12 text-gray-500">
          No users available. Add a new user to get started.
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderHeader()}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A complete list of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.user_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_admin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateUserRole.mutate({ user_id: user.user_id, is_admin: !user.is_admin })}
                          disabled={updateUserRole.isPending}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
