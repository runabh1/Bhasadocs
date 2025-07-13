'use server';

/**
 * @fileOverview Generates a draft document (government document, legal form, or personal letter) based on user input.
 *
 * - generateDocument - A function that handles the document generation process.
 * - GenerateDocumentInput - The input type for the generateDocument function.
 * - GenerateDocumentOutput - The return type for the generateDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentInputSchema = z.object({
  voiceInputText: z
    .string()
    .describe("The interpreted text from the user's voice input."),
  language: z
    .string()
    .default('en')
    .describe('The language in which to generate the document (e.g., en, as).'),
});
export type GenerateDocumentInput = z.infer<typeof GenerateDocumentInputSchema>;

const GenerateDocumentOutputSchema = z.object({
  documentDraft: z.string().describe('The generated draft document.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentInput): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const generateDocumentPrompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: GenerateDocumentInputSchema},
  output: {schema: GenerateDocumentOutputSchema},
  prompt: `You are an AI assistant that helps users generate draft documents, legal forms, and personal letters in their local language.

  Based on the user's voice input, generate a draft document in the specified language.  The document should be well-formatted and easy to read.

  Voice Input Text: {{{voiceInputText}}}
  Language: {{{language}}}

  Draft Document:`,  
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: GenerateDocumentInputSchema,
    outputSchema: GenerateDocumentOutputSchema,
  },
  async input => {
    const {output} = await generateDocumentPrompt(input);
    return output!;
  }
);
