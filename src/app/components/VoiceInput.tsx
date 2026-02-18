import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Browser Anda tidak mendukung voice input');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Mendengarkan...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      toast.success('Teks berhasil diinput');
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error('Error: ' + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={`h-9 w-9 ${className}`}
      onClick={startListening}
      disabled={isListening}
    >
      {isListening ? (
        <MicOff className="h-5 w-5 text-blue-500 animate-pulse" />
      ) : (
        <Mic className="h-5 w-5 text-blue-500" />
      )}
    </Button>
  );
}
