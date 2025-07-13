'use server';

/**
 * @fileOverview Converts voice input to text using Genkit.
 *
 * - voiceToText - A function that converts audio data to text.
 * - VoiceToTextInput - The input type for the voiceToText function.
 * - VoiceToTextOutput - The return type for the voiceToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Audio data as a data URI (e.g., data:audio/wav;base64,...).'
    ),
});
export type VoiceToTextInput = z.infer<typeof VoiceToTextInputSchema>;

const VoiceToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type VoiceToTextOutput = z.infer<typeof VoiceToTextOutputSchema>;

export async function voiceToText(input: VoiceToTextInput): Promise<VoiceToTextOutput> {
  return voiceToTextFlow(input);
}

const voiceToTextPrompt = ai.definePrompt({
  name: 'voiceToTextPrompt',
  input: {schema: VoiceToTextInputSchema},
  output: {schema: VoiceToTextOutputSchema},
  prompt: `Transcribe the following audio to text:

  {{media url=audioDataUri}}`,
});

const voiceToTextFlow = ai.defineFlow(
  {
    name: 'voiceToTextFlow',
    inputSchema: VoiceToTextInputSchema,
    outputSchema: VoiceToTextOutputSchema,
  },
  async input => {
    const {output} = await voiceToTextPrompt(input);
    return output!;
  }
);
