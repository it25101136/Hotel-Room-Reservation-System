import { useState, useRef, useEffect } from "react";
import { useToast } from "./Toast";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickReplies = [
  "Check availability",
  "Spa booking",
  "Restaurant reservation",
  "Concierge services",
  "Special requests",
];

export default function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Aurum Hotel! How may I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      let responseText = "Thank you for your inquiry. Our concierge will assist you shortly.";

      if (text.toLowerCase().includes("check") || text.toLowerCase().includes("availability")) {
        responseText = "I'd be happy to check availability for you. What dates are you looking to stay?";
      } else if (text.toLowerCase().includes("spa")) {
        responseText = "Our spa offers world-class treatments. Would you like to book a specific treatment or see our menu?";
      } else if (text.toLowerCase().includes("restaurant") || text.toLowerCase().includes("dining")) {
        responseText = "Our signature restaurant is available for reservations. What time and how many guests?";
      } else if (text.toLowerCase().includes("concierge")) {
        responseText = "Our 24/7 concierge can assist with airport transfers, event tickets, tours, and more. What do you need?";
      } else if (text.toLowerCase().includes("room") || text.toLowerCase().includes("suite")) {
        responseText = "We have Deluxe Rooms, Executive Suites, and Presidential Suites available. Would you like to see details?";
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      addToast("New message from concierge", "info");
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-black shadow-2xl shadow-gold-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-[pulseGlow_2s_ease-in-out_infinite]"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
        )}
      </button>

          {/* Chat Window */}
          {isOpen && (
            <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-sm shadow-2xl shadow-gold-500/20 border border-gray-200 animate-[scaleIn_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-dark-400 text-white p-4 rounded-t-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="font-display font-bold text-black">A</span>
              </div>
              <div>
                <div className="font-bold">Aurum Concierge</div>
                <div className="text-xs text-gold-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-marble-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-sm ${
                    message.isUser
                      ? "bg-gold-500 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? "text-gold-200" : "text-gray-400"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-sm border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="text-xs text-gold-600 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-marble-50 border border-gray-200 px-4 py-2 text-sm focus:border-gold-500 outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
