
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, XCircle } from "lucide-react";

const pollFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  options: z.array(z.object({ text: z.string().min(1, "Option text cannot be empty") })).min(2, "At least two options are required"),
});

type PollFormValues = z.infer<typeof pollFormSchema>;

interface CreatePollFormProps {
  setOpen: (open: boolean) => void;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ setOpen }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (values: PollFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Insert into poll_item
      const { data: pollData, error: pollError } = await supabase
        .from("poll_item")
        .insert({
          poll_title: values.title,
          poll_description: values.description,
          created_by_id: user.id,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Insert into poll_option
      const optionsToInsert = values.options.map(option => ({
        poll_id: pollData.poll_id,
        option_text: option.text,
      }));

      const { error: optionsError } = await supabase
        .from("poll_option")
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      toast.success("Poll created successfully!");
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      setOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create poll.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., What's your favorite programming language?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add more context to your poll..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Options</FormLabel>
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input {...field} placeholder={`Option ${index + 1}`} />
                      </FormControl>
                      {fields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <XCircle className="h-5 w-5 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append({ text: "" })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePollForm;
