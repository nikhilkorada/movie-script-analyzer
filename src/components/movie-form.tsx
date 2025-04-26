
"use client";

import type * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Film,
  Users,
  Calendar,
  Tag,
  User,
  AlignLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

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
import type { PredictVerdictInput, PredictVerdictOutput } from "@/ai/flows/predict-verdict";

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Movie title is required." }),
  cast: z.string().min(1, { message: "At least one cast member is required." }),
  releaseDate: z.string().min(1, { message: "Release date is required." }), // Simple string for now
  genre: z.string().min(1, { message: "Genre is required." }),
  director: z.string().min(1, { message: "Director is required." }),
  synopsis: z.string().min(10, { message: "Synopsis must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface MovieFormProps {
  onSubmit: (data: PredictVerdictInput) => Promise<void>;
  isLoading: boolean;
}

export function MovieForm({ onSubmit, isLoading }: MovieFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      cast: "",
      releaseDate: "",
      genre: "",
      director: "",
      synopsis: "",
    },
  });

  function handleSubmit(values: FormValues) {
    const inputData: PredictVerdictInput = {
      ...values,
      // Split comma-separated cast string into an array
      cast: values.cast.split(',').map(name => name.trim()).filter(name => name.length > 0),
    };
    onSubmit(inputData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Film className="inline-block mr-2 h-4 w-4" /> Movie Title
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Galactic Adventure" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cast"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Users className="inline-block mr-2 h-4 w-4" /> Cast
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe, John Smith" {...field} />
              </FormControl>
              <FormDescription>
                Enter cast members separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Calendar className="inline-block mr-2 h-4 w-4" /> Release Date
                </FormLabel>
                <FormControl>
                   {/* Using Input type="date" for simplicity */}
                   <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tag className="inline-block mr-2 h-4 w-4" /> Genre
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sci-Fi, Comedy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <User className="inline-block mr-2 h-4 w-4" /> Director
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Alex Ray" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="synopsis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <AlignLeft className="inline-block mr-2 h-4 w-4" /> Synopsis
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief synopsis of the movie..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" /> Predict Verdict
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
