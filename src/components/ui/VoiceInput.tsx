import { useEffect } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isListening: boolean;
    setIsListening: (listening: boolean) => void;
}

export function VoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn('Web Speech API not supported');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                onTranscript(finalTranscript);
            }
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening, onTranscript]);

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsListening(!isListening)}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening
                ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                : 'bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30'
                }`}
        >
            {isListening ? (
                <>
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500/50"></span>
                    <MicOff size={24} className="text-white relative z-10" />
                </>
            ) : (
                <Mic size={24} className="relative z-10" />
            )}

            {!isListening && (
                <div className="absolute -top-1 -right-1">
                    <Sparkles size={16} className="text-secondary animate-pulse" />
                </div>
            )}
        </motion.button>
    );
}
