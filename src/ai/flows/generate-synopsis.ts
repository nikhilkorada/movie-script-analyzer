'use server';
/**
 * @fileOverview Generates a movie synopsis from a concept description.
 *
 * - generateSynopsis - A function that generates a movie synopsis.
 * - GenerateSynopsisInput - The input type for the generateSynopsis function.
 * - GenerateSynopsisOutput - The return type for the generateSynopsis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSynopsisInputSchema = z.object({
  conceptDescription: z
    .string()
    .describe('A brief concept description of the movie.'),
});
export type GenerateSynopsisInput = z.infer<typeof GenerateSynopsisInputSchema>;

const GenerateSynopsisOutputSchema = z.object({
  synopsis: z.string().describe('The generated movie synopsis.'),
});
export type GenerateSynopsisOutput = z.infer<typeof GenerateSynopsisOutputSchema>;

export async function generateSynopsis(input: GenerateSynopsisInput): Promise<GenerateSynopsisOutput> {
  return generateSynopsisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSynopsisPrompt',
  input: {
    schema: z.object({
      conceptDescription: z
        .string()
        .describe('A brief concept description of the movie.'),
    }),
  },
  output: {
    schema: z.object({
      synopsis: z.string().describe('The generated movie synopsis.'),
    }),
  },
  prompt: `You are a professional screenwriter. Generate a detailed movie synopsis based on the following concept description: {{{conceptDescription}}}`,
});

const generateSynopsisFlow = ai.defineFlow<
  typeof GenerateSynopsisInputSchema,
  typeof GenerateSynopsisOutputSchema
>(
  {
    name: 'generateSynopsisFlow',
    inputSchema: GenerateSynopsisInputSchema,
    outputSchema: GenerateSynopsisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
