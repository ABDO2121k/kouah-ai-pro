// pages/chat-button.tsx
"use client"
import { useEffect, useState } from 'react';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'openChat') {
        setIsOpen(true);
      } else if (event.data === 'closeChat') {
        setIsOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    window.parent.postMessage(newIsOpen ? 'openChat' : 'closeChat', '*');
  };

  return (
    <div>
      <button
        id="chat-button"
        onClick={toggleChat}
        style={{
          width: '56px',
          height: '56px',
          border: '2px solid #e2e8f0',
          borderRadius: '50%',
          background: 'none',
          cursor: 'pointer',
        }}
        className='truncate'
      >
        {isOpen ? 'HHHHHH' : 'Chat'}
      </button>
    </div>
  );
};

export default ChatButton;
