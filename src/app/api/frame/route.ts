// app/api/chat-iframe/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { margin: 0; padding: 0; }
          #chat-button-frame {
            position: fixed;
            right: 1rem;
            bottom: 1rem;
            width: 60px;
            height: 60px;
            border: none;
          }
          #chat-iframe {
            display: none;
            position: fixed;
            right: 1rem;
            bottom: 6rem;
            width: 30rem;
            height: 80vh;
            border: 2px solid #e2e8f0;
            border-radius: 0.375rem;
          }
          @media (max-width: 1000px) {
            #chat-iframe {
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }
          }
        </style>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <iframe id="chat-button-frame" src="/buttonT"></iframe>
        <iframe
          id="chat-iframe"
          src="/embed/cm1725s9u000h12a5o0kmgfup"
          allow="clipboard-read; clipboard-write"
          allowfullscreen
        ></iframe>

        <script>
          const buttonFrame = document.getElementById('chat-button-frame');
          const chatIframe = document.getElementById('chat-iframe');

          window.addEventListener('message', function (event) {
            if (event.data === 'openChat') {
              chatIframe.style.display = 'block';
            } else if (event.data === 'closeChat') {
              chatIframe.style.display = 'none';
            }
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
