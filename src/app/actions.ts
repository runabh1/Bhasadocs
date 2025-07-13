'use server';

import { generateDocument } from "@/ai/flows/generate-document";
import { summarizeRequest } from "@/ai/flows/summarize-request";
import { voiceToText } from "@/ai/flows/voice-to-text";

interface GenerationResult {
    transcribedText: string | null;
    summary: string | null;
    generatedDocument: string | null;
    error: string | null;
}

export async function handleVoiceInput(audioDataUri: string, language: string): Promise<GenerationResult> {
    try {
        if (!audioDataUri) {
            throw new Error('Audio data is missing.');
        }

        const { text: transcribedText } = await voiceToText({ audioDataUri });
        if (!transcribedText) {
            throw new Error('Could not transcribe audio. Please try again.');
        }

        const { summary } = await summarizeRequest({ request: transcribedText });
        const { documentDraft: generatedDocument } = await generateDocument({ voiceInputText: transcribedText, language });

        return { transcribedText, summary, generatedDocument, error: null };
    } catch (e: any) {
        console.error("Error in handleVoiceInput:", e);
        return {
            transcribedText: null,
            summary: null,
            generatedDocument: null,
            error: e.message || 'An unknown error occurred during voice processing.',
        };
    }
}


export async function handleTextInput(text: string, language: string): Promise<GenerationResult> {
    try {
        if (!text || text.trim() === '') {
            throw new Error('Text input is empty.');
        }
        
        const { summary } = await summarizeRequest({ request: text });
        const { documentDraft: generatedDocument } = await generateDocument({ voiceInputText: text, language });

        return { transcribedText: text, summary, generatedDocument, error: null };
    } catch (e: any)
    {
        console.error("Error in handleTextInput:", e);
        return {
            transcribedText: text,
            summary: null,
            generatedDocument: null,
            error: e.message || 'An unknown error occurred during text processing.',
        };
    }
}
