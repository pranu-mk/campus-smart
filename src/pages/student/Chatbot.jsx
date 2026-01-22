import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, HelpCircle, GraduationCap, FileText, DollarSign } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
const quickActions = [
    { icon: HelpCircle, label: "How to raise a complaint?", query: "How do I raise a complaint?" },
    { icon: GraduationCap, label: "Scholarship info", query: "What scholarships are available?" },
    { icon: FileText, label: "Exam schedule", query: "When are my exams?" },
    { icon: DollarSign, label: "Fee details", query: "What is my fee status?" },
];
const botResponses = {
    "how do i raise a complaint?": "To raise a complaint:\n\n1. Go to 'Raise Complaint' from the sidebar\n2. Select a category (Hostel, Exam, Faculty, etc.)\n3. Fill in the sub-category and description\n4. Upload any supporting documents\n5. Click Submit\n\nYou'll receive a complaint ID for tracking.",
    "what scholarships are available?": "We offer several scholarships:\n\n• Merit Scholarship (CGPA > 8.5) - ₹50,000/year\n• Need-based Scholarship (Income < ₹3L) - ₹30,000/year\n• Sports Scholarship - ₹25,000/year\n• Research Grant - ₹40,000/year\n\nVisit the Scholarship section to check your eligibility!",
    "when are my exams?": "Your upcoming exams:\n\n📚 DBMS - Jan 25, Hall A, Seat A-45\n📚 Computer Networks - Jan 27, Hall B\n📚 Operating Systems - Jan 29, Hall C\n📚 Software Engineering - Jan 31, Hall A\n\nDownload hall tickets from Exam Hall Allocation.",
    "what is my fee status?": "Your fee status:\n\n✅ Tuition Fee: Paid\n✅ Hostel Fee: Paid\n⏳ Exam Fee: Due by Jan 25\n\nTotal Due: ₹5,000\n\nVisit the Student Helpdesk for payment queries.",
    "default": "I'm here to help! You can ask me about:\n\n• Raising complaints\n• Scholarship information\n• Exam schedules\n• Fee details\n• Lost & Found\n• Events and clubs\n\nHow can I assist you today?",
};
const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: "1",
            type: "bot",
            text: "Hello! 👋 I'm your campus assistant. How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSend = (text = input) => {
        if (!text.trim())
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: "user",
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        // Simulate bot response
        setTimeout(() => {
            const lowerText = text.toLowerCase().trim();
            const response = botResponses[lowerText] || botResponses["default"];
            const botMessage = {
                id: (Date.now() + 1).toString(),
                type: "bot",
                text: response,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };
    return (React.createElement(MainLayout, null,
        React.createElement(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "mb-6" },
            React.createElement("h1", { className: "text-2xl font-bold text-[#1f2937]" }, "Campus Chatbot"),
            React.createElement("p", { className: "text-[#6b7280]" }, "24/7 AI-powered assistance")),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6" },
            React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "lg:col-span-3 bg-white rounded-2xl shadow-card flex flex-col h-[600px]" },
                React.createElement("div", { className: "p-4 border-b border-gray-100 flex items-center gap-3" },
                    React.createElement("div", { className: "w-10 h-10 rounded-full bg-[#4f6fdc] flex items-center justify-center" },
                        React.createElement(Bot, { className: "w-5 h-5 text-white" })),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold text-[#1f2937]" }, "Campus Assistant"),
                        React.createElement("p", { className: "text-xs text-[#49b675]" }, "\u25CF Online"))),
                React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-4" },
                    messages.map((message) => (React.createElement(motion.div, { key: message.id, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `flex ${message.type === "user" ? "justify-end" : "justify-start"}` },
                        React.createElement("div", { className: `flex items-end gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}` },
                            React.createElement("div", { className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user" ? "bg-[#4f6fdc]" : "bg-gray-100"}` }, message.type === "user" ? (React.createElement(User, { className: "w-4 h-4 text-white" })) : (React.createElement(Bot, { className: "w-4 h-4 text-[#4f6fdc]" }))),
                            React.createElement("div", { className: `p-3 rounded-2xl ${message.type === "user"
                                    ? "bg-[#4f6fdc] text-white rounded-br-md"
                                    : "bg-gray-100 text-[#1f2937] rounded-bl-md"}` },
                                React.createElement("p", { className: "text-sm whitespace-pre-line" }, message.text),
                                React.createElement("p", { className: `text-xs mt-1 ${message.type === "user" ? "text-white/70" : "text-[#6b7280]"}` }, message.time)))))),
                    React.createElement("div", { ref: messagesEndRef })),
                React.createElement("div", { className: "p-4 border-t border-gray-100" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === "Enter" && handleSend(), placeholder: "Type your message...", className: "flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4f6fdc] outline-none text-[#1f2937]" }),
                        React.createElement("button", { onClick: () => handleSend(), className: "p-3 rounded-xl bg-[#4f6fdc] text-white hover:bg-[#4560c7] transition-colors" },
                            React.createElement(Send, { className: "w-5 h-5" }))))),
            React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "space-y-4" },
                React.createElement("div", { className: "bg-white rounded-2xl shadow-card p-4" },
                    React.createElement("h3", { className: "font-semibold text-[#1f2937] mb-3" }, "Quick Actions"),
                    React.createElement("div", { className: "space-y-2" }, quickActions.map((action) => {
                        const Icon = action.icon;
                        return (React.createElement("button", { key: action.label, onClick: () => handleSend(action.query), className: "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left" },
                            React.createElement("div", { className: "w-8 h-8 rounded-lg bg-[#4f6fdc]/10 flex items-center justify-center" },
                                React.createElement(Icon, { className: "w-4 h-4 text-[#4f6fdc]" })),
                            React.createElement("span", { className: "text-sm text-[#1f2937]" }, action.label)));
                    }))),
                React.createElement("div", { className: "bg-gradient-to-br from-[#4f6fdc] to-[#5b7cfa] rounded-2xl p-4 text-white" },
                    React.createElement(Bot, { className: "w-8 h-8 mb-3 opacity-80" }),
                    React.createElement("h3", { className: "font-semibold mb-1" }, "Need More Help?"),
                    React.createElement("p", { className: "text-sm text-white/80" }, "Visit the Student Helpdesk or raise a support ticket for complex queries."))))));
};
export default Chatbot;
