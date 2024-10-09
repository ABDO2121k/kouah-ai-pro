"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const ChatbotToggleButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "openChat") {
        setIsOpen(prev=>!prev);
      } else if (event.data === "closeChat") {
        setIsOpen(prev=>!prev);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const toggleChat = () => {
    window.parent.postMessage(!isOpen ? "openChat" : "closeChat", "*");
  };

  return (
    <motion.div
      className="h-screen w-screen flex justify-center items-center overflow-hidden background-transparent"
      initial={{ scale: 0 }}
      animate={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <button
        id="chat-button"
        onClick={toggleChat}
        className="w-20 h-20 border-2 m-auto border-slate-200 rounded-full bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        > 
          {isOpen ? (
            <X className="text-slate-600 h-8 w-8" />
          ) : (
            <MessageCircle className="text-slate-600 h-10 w-10" />
          )}
        </motion.div>
      </button>
    </motion.div>
  );
};

export default ChatbotToggleButton;
