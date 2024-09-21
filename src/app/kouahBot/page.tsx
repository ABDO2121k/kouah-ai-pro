"use client"
import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed right-4 bottom-4 rounded-full w-14 h-14 p-0 shadow-md"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      {isOpen && (
        <iframe
          src="http://localhost:3000/embed/cm1725s9u000h12a5o0kmgfup"
          className="fixed right-4 bottom-20 w-96 h-[65vh] border-2 border-gray-200 rounded-md shadow-md"
          style={{
            width: window.innerWidth < 640 ? '100%' : '30rem',
            height: window.innerWidth < 640 ? '100%' : '65vh',
            top: window.innerWidth < 640 ? 0 : 'auto',
            left: window.innerWidth < 640 ? 0 : 'auto',
            zIndex: 9999,
          }}
          allow="clipboard-read; clipboard-write"
          allowFullScreen
        />
      )}
    </>
  );
};

export default ChatInterface;