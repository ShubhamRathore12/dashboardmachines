"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// Form validation schema
const formSchema = z.object({
  machineName: z.string().min(2, {
    message: "Machine name must be at least 2 characters.",
  }),
  machineDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  file: z.any().optional(),
  role: z.enum(["admin", "guest", "user"]),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

export default function MachineForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineName: "",
      machineDescription: "",
      role: "user",
      username: "",
    },
  });

  // Handle file upload
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("machineName", values.machineName);
      formData.append("machineDescription", values.machineDescription);
      formData.append("role", values.role);
      formData.append("username", values.username);

      if (file) {
        formData.append("file", file);
      }

      // Send data to API route
      const response = await fetch("/api/machines", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description: "Machine data has been saved successfully.",
      });

      // Reset form
      form.reset();
      setFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Machine</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Machine Name */}
          <FormField
            control={form.control}
            name="machineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter machine name" {...field} />
                </FormControl>
                <FormDescription>The name of your machine.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Machine Description */}
          <FormField
            control={form.control}
            name="machineDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter machine description"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide details about this machine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload (optional) */}
          <FormItem>
            <FormLabel>Upload File (Optional)</FormLabel>
            <FormControl>
              <Input type="file" onChange={handleFileChange} />
            </FormControl>
            <FormDescription>Upload any related documents.</FormDescription>
            {file && (
              <p className="text-sm text-green-600">
                File selected: {file.name}
              </p>
            )}
          </FormItem>

          {/* Role Dropdown */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the appropriate role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormDescription>Your username.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Machine"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
