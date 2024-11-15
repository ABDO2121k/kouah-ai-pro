"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { useButtonDesign } from "@/hooks/chatbot/use-chatbot";

interface Props {
  params: {
    chatbotId: string;
  };
}

const ChatbotToggleButton = ({ params }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { buttonDesign, loading } = useButtonDesign(params.chatbotId);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "openChat") {
        setIsOpen(prev => !prev);
      } else if (event.data === "closeChat") {
        setIsOpen(prev => !prev);
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

  const buttonStyle = {
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    ...(buttonDesign.useCustomButton && {
      backgroundColor: !isOpen ? buttonDesign.buttonBackground : buttonDesign.buttonFullBg ? buttonDesign.buttonBackground : 'white',
      border: !isOpen 
        ? 'none' 
        : !buttonDesign.buttonFullBg 
          ? `2px solid ${buttonDesign.buttonBackground}` 
          : 'none',
      ...(buttonDesign.buttonFullBg && buttonDesign.buttonImage && !isOpen && {
        backgroundImage: `url(${buttonDesign.buttonImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    })
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
        className="w-20 h-20 rounded-full hover:opacity-90 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-200 shadow-md"
        style={buttonStyle}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center w-full h-full"
        >
          {isOpen ? (
            <X 
              className="w-8 h-8"
              style={{ 
                color: buttonDesign.useCustomButton 
                  ? buttonDesign.buttonFullBg 
                    ? 'white' 
                    : buttonDesign.buttonBackground
                  : '#64748b'
              }}
            />
          ) : (
            buttonDesign.useCustomButton && buttonDesign.buttonImage ? (
              buttonDesign.buttonFullBg ? null : (
                <div className="w-[70%] h-[70%] relative flex items-center justify-center">
                  <Image
                    src={buttonDesign.buttonImage}
                    alt="Chat Button"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
              )
            ) : (
              <MessageCircle 
                className="h-10 w-10"
                style={{ 
                  color: buttonDesign.useCustomButton ? 'white' : '#64748b'
                }}
              />
            )
          )}
        </motion.div>
      </button>
    </motion.div>
  );
};

export default ChatbotToggleButton;