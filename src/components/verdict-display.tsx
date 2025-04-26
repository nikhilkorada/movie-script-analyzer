
"use client";

import type * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react"; // Using thumbs icons
import type { PredictVerdictOutput } from "@/ai/flows/predict-verdict";

interface VerdictDisplayProps {
  verdictData: PredictVerdictOutput | null;
}

export function VerdictDisplay({ verdictData }: VerdictDisplayProps) {
  if (!verdictData) {
    return null; // Don't render anything if there's no data yet
  }

  const { verdict, justification } = verdictData;

  const getVerdictStyles = (verdict: string) => {
    const lowerVerdict = verdict.toLowerCase();
    if (lowerVerdict.includes("hit")) {
      return {
        icon: <ThumbsUp className="h-6 w-6 text-green-500" />,
        badgeVariant: "default" as const, // Use specific ShadCN variants
        badgeClass: "bg-green-500 hover:bg-green-600 text-white",
        titleClass: "text-green-600",
      };
    } else if (lowerVerdict.includes("flop")) {
      return {
        icon: <ThumbsDown className="h-6 w-6 text-red-500" />,
        badgeVariant: "destructive" as const,
        badgeClass: "bg-red-500 hover:bg-red-600 text-white",
        titleClass: "text-red-600",
      };
    } else { // Default to average/neutral
      return {
        icon: <Meh className="h-6 w-6 text-yellow-500" />,
        badgeVariant: "secondary" as const,
        badgeClass: "bg-yellow-500 hover:bg-yellow-600 text-black",
        titleClass: "text-yellow-600",
      };
    }
  };

  const { icon, badgeVariant, badgeClass, titleClass } = getVerdictStyles(verdict);

  return (
    <Card className="mt-8 shadow-lg animate-in fade-in duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-2xl font-bold ${titleClass}`}>
          Predicted Verdict
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Badge variant={badgeVariant} className={`text-lg capitalize px-4 py-1 ${badgeClass}`}>
            {verdict}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-semibold mb-1">Justification:</p>
        <p className="text-base text-foreground">{justification}</p>
      </CardContent>
    </Card>
  );
}
