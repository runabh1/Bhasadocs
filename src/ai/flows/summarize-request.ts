'use server';

/**
 * @fileOverview Summarizes the user's request after voice input conversion.
 *
 * - summarizeRequest - A function that summarizes the user's request.
 * - SummarizeRequestInput - The input type for the summarizeRequest function.
 * - SummarizeRequestOutput - The return type for the summarizeRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRequestInputSchema = z.object({
  request: z
    .string()
    .describe('The user request to be summarized, converted from voice input.'),
});
export type SummarizeRequestInput = z.infer<typeof SummarizeRequestInputSchema>;

const SummarizeRequestOutputSchema = z.object({
  summary: z.string().describe('A short summary of the user request.'),
});
export type SummarizeRequestOutput = z.infer<typeof SummarizeRequestOutputSchema>;

export async function summarizeRequest(input: SummarizeRequestInput): Promise<SummarizeRequestOutput> {
  return summarizeRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRequestPrompt',
  input: {schema: SummarizeRequestInputSchema},
  output: {schema: SummarizeRequestOutputSchema},
  prompt: `Summarize the following user request in a single sentence:

{{{request}}}`,
});

const summarizeRequestFlow = ai.defineFlow(
  {
    name: 'summarizeRequestFlow',
    inputSchema: SummarizeRequestInputSchema,
    outputSchema: SummarizeRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
