// app/api/chat-button/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { margin: 0; padding: 0; }
          #chat-button {
            width: 56px;
            height: 56px;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            background: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <button id="chat-button">Chat</button>

        <script>
          const button = document.getElementById('chat-button');
          let isOpen = false;

          function toggleChat() {
            isOpen = !isOpen;
            window.parent.postMessage(isOpen ? 'openChat' : 'closeChat', '*');
            button.textContent = isOpen ? 'Close' : 'Chat';
          }

          button.addEventListener('click', toggleChat);

          window.addEventListener('message', function (event) {
            if (event.data === 'openChat') {
              isOpen = true;
              button.textContent = 'Close';
            } else if (event.data === 'closeChat') {
              isOpen = false;
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