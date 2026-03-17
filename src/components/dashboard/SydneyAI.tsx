import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Send, X, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { getAIResponse } from "@/lib/groq";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTIONS = [
    "I've been feeling anxious lately 😟",
    "I can't sleep and my mind won't stop 🌙",
    "I want to talk about my day 💬",
    "How do I manage stress better? 🧘",
];

interface SydneyProps {
    isOpen: boolean;
    onClose: () => void;
    inline?: boolean;
}

export const SydneyAI = ({ isOpen, onClose, inline = false }: SydneyProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Greeting on first open
            setTimeout(() => {
                setMessages([
                    {
                        role: "assistant",
                        content: "Hey! I'm Sydney 💜\n\nI'm your personal AI companion here on TherapEASE. Think of me as a calm space where you can say anything — no judgment, no pressure.\n\nWhat's on your mind today?",
                    },
                ]);
            }, 400);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;
        setShowSuggestions(false);

        const userMessage: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const response = await getAIResponse([...messages, userMessage]);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        setIsLoading(false);

        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleReset = () => {
        setMessages([]);
        setShowSuggestions(true);
        setTimeout(() => {
            setMessages([{
                role: "assistant",
                content: "Fresh start 🌱 I'm still here. What would you like to talk about?",
            }]);
        }, 300);
    };

    const chatContent = (
        <div className={`flex flex-col ${inline ? "h-[600px]" : "h-full"}`}>
            {/* Messages area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4"
                style={{ background: "linear-gradient(180deg, hsl(262 68% 58% / 0.02) 0%, transparent 100%)" }}
            >
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {m.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                                    <Sparkles className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-sm shadow-[0_4px_20px_hsl(262_68%_58%/0.25)]"
                                    : "bg-card border border-border rounded-bl-sm shadow-sm text-foreground"
                                    }`}
                            >
                                {m.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 items-end"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                            <div className="flex gap-1.5 items-center h-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-primary/60"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Suggestions */}
                {showSuggestions && messages.length <= 1 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-2 pt-2"
                    >
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                onClick={() => sendMessage(s)}
                                className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 transition-all duration-200 text-muted-foreground hover:text-foreground leading-snug"
                            >
                                {s}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                    className="flex gap-2 items-center"
                >
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Talk to Sydney…"
                        className="rounded-full bg-background border-border focus-visible:ring-primary/30 text-sm h-11"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_hsl(262_68%_58%/0.3)] hover:shadow-[0_6px_24px_hsl(262_68%_58%/0.4)] hover:opacity-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 text-white" />
                        )}
                    </button>
                </form>
                <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
                    Sydney is an AI — not a licensed therapist. In crisis? Call 988 (US) or iCall: 9152987821
                </p>
            </div>
        </div>
    );

    if (inline) {
        if (!isOpen) return null;
        return (
            <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-card flex flex-col">
                {/* Header */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(290_70%_70%/0.3),_transparent)]" />
                    <div className="relative z-10 flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="font-display font-bold text-white text-base">Sydney</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-white/70 text-xs">AI Companion · Always here</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                                title="New conversation"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
                {chatContent}
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="fixed bottom-6 right-6 w-[400px] h-[580px] bg-card border border-border rounded-2xl shadow-[0_24px_80px_hsl(262_68%_58%/0.2)] flex flex-col z-50 overflow-hidden"
                >
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(290_70%_70%/0.3),_transparent)]" />
                        <div className="relative z-10 flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-display font-bold text-white text-base">Sydney</div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-white/70 text-xs">AI Companion · Always here</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleReset} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white" title="New conversation">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {chatContent}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
