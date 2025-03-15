import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const INTERESTS = [
  "Technology", "Business", "Marketing", "Design",
  "Finance", "Healthcare", "Education", "Engineering"
];

export function WaitlistForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      email: "",
      fullName: "",
      interests: [],
      location: "",
      profession: ""
    }
  });

  async function onSubmit(data: any) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/waitlist", data);
      toast({
        title: "Successfully joined waitlist!",
        description: "We'll notify you when we launch.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to join waitlist",
        description: error.message || "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      variant={field.value.includes(interest) ? "default" : "outline"}
                      onClick={() => {
                        const newValue = field.value.includes(interest)
                          ? field.value.filter((i: string) => i !== interest)
                          : [...field.value, interest];
                        field.onChange(newValue);
                      }}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>
    </Form>
  );
}
