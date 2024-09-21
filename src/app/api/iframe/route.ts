// app/api/iframe/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          #chat-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: #007bff;
            color: white;
            font-size: 16px;
            cursor: pointer;
            z-index: 1000;
          }
          #chat-container {
            position: fixed;
            right: 20px;
            bottom: 100px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: none;
            overflow: hidden;
            z-index: 999;
          }
          #chat-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          @media (max-width: 640px) {
            #chat-container {
              width: 90%;
              height: 80%;
              right: 5%;
              bottom: 100px;
            }
          }
        </style>
      </head>
      <body>
        <button id="chat-button">Chat</button>
        <div id="chat-container">
          <iframe
            id="chat-iframe"
            src="http://localhost:3000/embed/cm1725s9u000h12a5o0kmgfup"
            allow="clipboard-read; clipboard-write"
            allowfullscreen
          ></iframe>
        </div>

        <script>
          const button = document.getElementById('chat-button');
          const container = document.getElementById('chat-container');
          let isOpen = false;

          function toggleChat() {
            isOpen = !isOpen;
            container.style.display = isOpen ? 'block' : 'none';
            button.textContent = isOpen ? 'Close' : 'Chat';
          }

          button.addEventListener('click', toggleChat);

          window.addEventListener('message', function (event) {
            if (event.data === 'openChat') {
              isOpen = true;
              container.style.display = 'block';
              button.textContent = 'Close';
            } else if (event.data === 'closeChat') {
              isOpen = false;
              container.style.display = 'none';
              button.textContent = 'Chat';
            }
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}