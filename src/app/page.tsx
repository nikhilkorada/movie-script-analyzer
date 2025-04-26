
"use client";

import type * as React from "react";
import { useState } from "react";
import { MovieForm } from "@/components/movie-form";
import { VerdictDisplay } from "@/components/verdict-display";
import { predictVerdict, type PredictVerdictInput, type PredictVerdictOutput } from "@/ai/flows/predict-verdict";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [verdict, setVerdict] = useState<PredictVerdictOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: PredictVerdictInput) => {
    setIsLoading(true);
    setError(null);
    setVerdict(null); // Clear previous verdict

    try {
      console.log("Sending data to AI:", data);
      const result = await predictVerdict(data);
      console.log("Received verdict:", result);
      setVerdict(result);
       toast({
        title: "Prediction Complete",
        description: `The verdict for "${data.title}" has been predicted.`,
      });
    } catch (err) {
       console.error("Error predicting verdict:", err);
       const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
       setError(`Prediction failed: ${errorMessage}`);
       toast({
         variant: "destructive",
         title: "Prediction Error",
         description: errorMessage,
       });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">VerdictVision</h1>
        <p className="text-lg text-muted-foreground">
          Enter movie details to predict its box office verdict using AI.
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Movie Information</CardTitle>
          <CardDescription>Fill in the details below to get a prediction.</CardDescription>
        </CardHeader>
        <CardContent>
           <MovieForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>


      {error && (
         <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

       {/* Use a placeholder or loading indicator */}
       {isLoading && (
         <div className="flex justify-center items-center mt-8 space-x-2">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           <p className="text-muted-foreground">Analyzing the script...</p>
         </div>
       )}

       {/* Display verdict only when not loading and verdict exists */}
       {!isLoading && verdict && <VerdictDisplay verdictData={verdict} />}

    </main>
  );
}
