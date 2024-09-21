"use client";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //eslint-disable-next-line
    const handleMessage = (event: any) => {
      if (event.data === "openChat") {
        setIsOpen(true);
      } else if (event.data === "closeChat") {
        setIsOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chat Interface</title>
      </Head>

      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          width: "56px",
          height: "56px",
          border: "2px solid #e2e8f0",
          borderRadius: "50%",
          background: "none",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close" : "Chat"}
      </button>

      {isOpen && (
        <iframe
          src="http://localhost:3000/embed/cm1725s9u000h12a5o0kmgfup"
          style={{
            display: "block",
            position: "fixed",
            right: "1rem",
            bottom: "6rem",
            width: "30rem",
            height: "65vh",
            border: "2px solid #e2e8f0",
            borderRadius: "0.375rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          allow="clipboard-read; clipboard-write"
          allowFullScreen
        />
      )}

      <style jsx global>{`
        @media (max-width: 640px) {
          iframe {
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
