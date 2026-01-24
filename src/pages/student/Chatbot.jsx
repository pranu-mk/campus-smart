import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, HelpCircle, GraduationCap, FileText, DollarSign, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { chatbotAPI } from "@/modules/student/services/api"; 
import { toast } from "@/hooks/use-toast";

const quickActions = [
    { icon: HelpCircle, label: "How to raise a complaint?", query: "How do I raise a complaint?" },
    { icon: GraduationCap, label: "Scholarship info", query: "What scholarships are available?" },
    { icon: FileText, label: "Exam schedule", query: "When are my exams?" },
    { icon: DollarSign, label: "Fee details", query: "What is my fee status?" },
];

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    // FIX: Standardize ref access to prevent TypeScript "Element Access" errors
    const scrollToBottom = () => {
        if (messagesEndRef.current !== null) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // STEP 1: Fetch Chat History on Load
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoadingHistory(true);
                const response = await chatbotAPI.getHistory();
                if (response.success) {
                    setMessages(response.history);
                }
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setIsLoadingHistory(false);
                // Slight delay to allow DOM to render before scrolling
                setTimeout(scrollToBottom, 100);
            }
        };
        fetchHistory();
    }, []);

    // Auto-scroll whenever messages change or bot starts/stops typing
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // STEP 2: Handle Dynamic Message Exchange
    const handleSend = async (text = input) => {
        if (!text.trim() || isTyping) return;

        const userText = text.trim();
        const tempId = Date.now().toString();

        const userMessage = {
            id: tempId,
            sender: "user",
            text: userText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await chatbotAPI.sendMessage(userText);
            
            if (response.success) {
                setMessages((prev) => [...prev, response.reply]);
            }
        } catch (error) {
            toast({
                title: "Bot Offline",
                description: "Couldn't reach the campus assistant. Please check your connection.",
                variant: "destructive",
            });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <MainLayout>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-6">
                <h1 className="text-2xl font-bold text-[#1f2937]">Campus Chatbot</h1>
                <p className="text-[#6b7280]">24/7 AI-powered assistance</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="lg:col-span-3 bg-white rounded-2xl shadow-card flex flex-col h-[600px] border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#4f6fdc] flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1f2937]">Campus Assistant</h3>
                                <p className="text-xs text-[#49b675]">● Online</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        {isLoadingHistory ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <p className="text-xs">Loading conversation...</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex items-end gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "user" ? "bg-[#4f6fdc]" : "bg-white border border-gray-100 shadow-sm"}`}>
                                            {message.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#4f6fdc]" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl shadow-sm ${message.sender === "user" ? "bg-[#4f6fdc] text-white rounded-br-md" : "bg-white text-[#1f2937] rounded-bl-md border border-gray-100"}`}>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                                            <p className={`text-[10px] mt-1 ${message.sender === "user" ? "text-white/70" : "text-[#6b7280]"}`}>{message.time}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        
                        <AnimatePresence>
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-md shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Scroll Target */}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                                placeholder="Ask me anything..." 
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/10 outline-none text-[#1f2937] transition-all" 
                            />
                            <button 
                                onClick={() => handleSend()} 
                                disabled={!input.trim() || isTyping}
                                className="p-3 rounded-xl bg-[#4f6fdc] text-white hover:bg-[#4560c7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md shadow-[#4f6fdc]/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-white rounded-2xl shadow-card p-4 border border-gray-100">
                        <h3 className="font-semibold text-[#1f2937] mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <button 
                                        key={action.label} 
                                        onClick={() => handleSend(action.query)} 
                                        disabled={isTyping}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[#4f6fdc]/10 flex items-center justify-center group-hover:bg-[#4f6fdc] transition-colors">
                                            <Icon className="w-4 h-4 text-[#4f6fdc] group-hover:text-white" />
                                        </div>
                                        <span className="text-sm text-[#1f2937]">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className="bg-gradient-to-br from-[#4f6fdc] to-[#5b7cfa] rounded-2xl p-4 text-white shadow-lg shadow-[#4f6fdc]/20">
                        <Bot className="w-8 h-8 mb-3 opacity-80" />
                        <h3 className="font-semibold mb-1">Need More Help?</h3>
                        <p className="text-sm text-white/80">Visit the Student Helpdesk or raise a support ticket for complex queries.</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Chatbot;