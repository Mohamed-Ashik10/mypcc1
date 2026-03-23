'use client';

import { useState, useEffect } from "react";

interface EchoAudioPlayerProps {
    title: string;
    fullText: string;
}

export default function EchoAudioPlayer({ title, fullText }: EchoAudioPlayerProps) {
    const fullTextToRead = `Heading: ${title}. Content: ${fullText}`;
    const initialTotal = Math.floor(fullTextToRead.length / 15);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSecond, setCurrentSecond] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(initialTotal || 5);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Update duration if props change
    useEffect(() => {
        const est = Math.floor(fullTextToRead.length / 15);
        setTotalSeconds(est || 1);
        console.log("Narrator Loaded. Text Length:", fullTextToRead.length, "Est Seconds:", est);
    }, [fullTextToRead]);

    // Timer: Runs solely based on React isPlaying state
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentSecond(prev => {
                    if (prev >= totalSeconds) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                        return prev; // Don't reset to 0 even at end? No, usually end resets. 
                        // But user said "needs to stop where it plays".
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalSeconds]);

    const stopAudio = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        // User requested: "Needs to stop where it plays" - removed reset to 0
    };

    const toggleAudio = (seekToSecond: number | null = null) => {
        // If we are playing and user clicks icon, just stop (pause)
        if (isPlaying && seekToSecond === null) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        window.speechSynthesis.cancel();
        
        const startSec = seekToSecond !== null ? seekToSecond : currentSecond;
        const charStart = Math.max(0, Math.floor(startSec * 15));
        const textToRead = fullTextToRead.substring(charStart);

        if (seekToSecond !== null) setCurrentSecond(seekToSecond);

        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.name.includes('Google US English')) || 
                        voices.find(v => v.name.includes('Natural')) || 
                        voices.find(v => v.lang === 'en-US') || 
                        voices[0];

        if (bestVoice) utterance.voice = bestVoice;
        utterance.pitch = 1.05;
        utterance.rate = 0.9;

        utterance.onend = () => {
            if (!window.speechSynthesis.speaking) {
                setIsPlaying(false);
            }
        };

        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }, 50);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const seekTo = Math.floor((percent / 100) * totalSeconds);
        toggleAudio(seekTo);
    };

    const handleSkip = (seconds: number) => {
        const nextSec = Math.max(0, Math.min(totalSeconds, currentSecond + seconds));
        toggleAudio(nextSec);
    };

    const progress = (currentSecond / (totalSeconds || 1)) * 100;

    return (
        <div className="bg-[#fcf9f2] border border-[#b8935a]/20 rounded-2xl px-6 py-4 flex items-center gap-5 shadow-sm mb-6">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleSkip(-10)}
                    className="text-[#b8935a] hover:opacity-70 transition text-xl"
                    title="Back 10s"
                >
                    ↺
                </button>
                <button 
                    onClick={() => toggleAudio()}
                    className="w-12 h-12 rounded-full bg-[#b8935a] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-105"
                >
                    {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl ml-1">▶</span>}
                </button>
                <button 
                    onClick={() => handleSkip(10)}
                    className="text-[#b8935a] hover:opacity-70 transition text-xl"
                    title="Forward 10s"
                >
                    ↻
                </button>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8935a]">AI Narrator (Admin Beta)</span>
                    <span className="text-xs font-black text-[#b8935a] font-mono min-w-[80px] text-right">
                        {formatTime(currentSecond)} / {formatTime(totalSeconds)}
                    </span>
                </div>
                <div 
                    onClick={handleSeek}
                    className="w-full h-2 bg-[#b8935a]/10 rounded-full cursor-pointer relative group"
                >
                    <div 
                        className="h-full bg-[#b8935a] transition-[width] duration-300 ease-linear rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-[-6px] top-[-4px] w-4 h-4 bg-[#b8935a] rounded-full shadow-md border-2 border-white scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                </div>
            </div>
            <button 
                onClick={stopAudio}
                className="px-4 py-2 bg-white border border-[#b8935a]/10 rounded-xl text-[10px] font-black text-[#6b7280] hover:bg-red-50 hover:text-red-500 hover:border-red-100 uppercase tracking-widest transition-all"
            >
                Stop
            </button>
        </div>
    );
}
