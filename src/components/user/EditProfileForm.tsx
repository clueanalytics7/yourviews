
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types";

const formSchema = z.object({
  user_name: z.string().min(3, "Username must be at least 3 characters long."),
});

interface EditProfileFormProps {
  profile: UserProfile;
  onSave: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: profile?.user_name || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-brand-purple hover:bg-brand-light-purple">
            Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
