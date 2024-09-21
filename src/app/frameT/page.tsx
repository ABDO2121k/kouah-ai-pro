// pages/chat-iframe.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const ChatIframe = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatIframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for postMessage events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "openChat") {
        setIsChatOpen(true);
      } else if (event.data === "closeChat") {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      {/* Chat Button Iframe */}
      <iframe
        id="chat-button-frame"
        src="/buttonT"
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          width: "60px",
          height: "60px",
          border: "none",
        }}
      />

      {/* Chat Iframe */}
      <iframe
        id="chat-iframe"
        ref={chatIframeRef}
        src="/embed/cm1725s9u000h12a5o0kmgfup"
        allow="clipboard-read; clipboard-write"
        allowFullScreen
        style={{
          display: isChatOpen ? "block" : "none",
          position: "fixed",
          right: "1rem",
          bottom: "6rem",
          width: "30rem",
          height: "65vh",
          border: "2px solid #e2e8f0",
          borderRadius: "0.375rem",
        }}
      />

      {/* Inline Styles for Mobile */}
      <style jsx>{`
        @media (max-width: 640px) {
          #chat-iframe {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatIframe;
