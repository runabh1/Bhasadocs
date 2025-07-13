'use client';

import { handleTextInput, handleVoiceInput } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Languages, Loader2, Mic, RefreshCw, Send, Square } from 'lucide-react';
import React, { useRef, useState, useTransition } from 'react';
import { Logo } from './icons/Logo';

type GenerationResult = {
    transcribedText: string | null;
    summary: string | null;
    generatedDocument: string | null;
};

export default function BhashaDocsApp() {
    const [language, setLanguage] = useState('as');
    const [isRecording, setIsRecording] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [textInput, setTextInput] = useState('');
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const { toast } = useToast();

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64Audio = reader.result as string;
                    startTransition(async () => {
                        const res = await handleVoiceInput(base64Audio, language);
                        if (res.error) {
                            toast({ variant: 'destructive', title: 'Error', description: res.error });
                            setResult(null);
                        } else {
                            setResult(res);
                        }
                    });
                };
                audioChunks.current = [];
            };
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access microphone. Please check your browser permissions.' });
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!textInput.trim()) return;
        startTransition(async () => {
            const res = await handleTextInput(textInput, language);
            if (res.error) {
                toast({ variant: 'destructive', title: 'Error', description: res.error });
                setResult(null);
            } else {
                setResult(res);
            }
        });
    };

    const resetState = () => {
        setResult(null);
        setTextInput('');
        setIsRecording(false);
        audioChunks.current = [];
    };

    const handlePrint = () => {
        window.print();
    };

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold font-headline">Generating your document...</h2>
                <p className="text-muted-foreground">This may take a few moments. Please wait.</p>
            </div>
        );
    }
    
    if (result && result.generatedDocument) {
        return (
            <Card className="w-full max-w-4xl shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <FileText />
                        Your Generated Document
                    </CardTitle>
                    <CardDescription>Based on your request: "{result.summary}"</CardDescription>
                </CardHeader>
                <CardContent>
                    <div id="printable-area" className="printable-area rounded-md border bg-muted/30 p-4">
                        <pre className="whitespace-pre-wrap font-body text-sm text-foreground">{result.generatedDocument}</pre>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                     <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto no-print">
                        <Download className="mr-2 h-4 w-4" />
                        Download as PDF
                    </Button>
                    <Button onClick={resetState} className="w-full sm:w-auto no-print">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start New Query
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="items-center text-center">
                <Logo />
                <CardDescription className="pt-2">
                    Generate documents, letters, and forms using your voice in your language.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="language-select" className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Select Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language-select" className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="as">Assamese (অসমীয়া)</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Tabs defaultValue="voice" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="voice">Voice Input</TabsTrigger>
                        <TabsTrigger value="text">Text Input</TabsTrigger>
                    </TabsList>
                    <TabsContent value="voice" className="mt-6 flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-sm text-muted-foreground">Press the button and speak your request.</p>
                        <Button
                            size="lg"
                            className={`h-20 w-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                        >
                            {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                        </Button>
                        <p className="text-xs text-muted-foreground">{isRecording ? "Recording... Click to stop." : "Click to start recording."}</p>
                    </TabsContent>
                    <TabsContent value="text" className="mt-6">
                        <form onSubmit={handleTextSubmit}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="text-input" className="sr-only">Your Request</Label>
                                <Textarea
                                    id="text-input"
                                    placeholder="e.g., How do I make land papers after my father’s death?"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    rows={4}
                                    className="text-base"
                                />
                                <Button type="submit" disabled={!textInput.trim()}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Generate Document
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
