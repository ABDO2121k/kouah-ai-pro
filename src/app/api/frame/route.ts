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
            right: 2%;
            bottom: 2%;
            border: none;
          }
          #chat-iframe {
            display: none;
            position: fixed;
            right: 4%;
            bottom: 6.5rem;
            width: 30rem;
            height: 80vh;
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
        <iframe id="chat-button-frame" src="/buttonT" class="h-24 w-24  overflow-hidden "></iframe>
        <iframe
          id="chat-iframe"
          src="/embed/cm1lghktm0001br0k599pwsvf"
          allow="clipboard-read; clipboard-write"
          allowfullscreen
          class="bg-transparent border-none overflow-x-hidden"
        ></iframe>

        <script>
          const buttonFrame = document.getElementById('chat-button-frame');
          const chatIframe = document.getElementById('chat-iframe');

          window.addEventListener('message', function (event) {
            if (event.data === 'openChat') {
              chatIframe.style.display = 'block';
              buttonFrame.contentWindow.postMessage('openChat', '*');
              chatIframe.contentWindow.postMessage('openChat', '*');

            } else if (event.data === 'closeChat') {
              chatIframe.style.display = 'none';
               buttonFrame.contentWindow.postMessage('closeChat', '*');
              chatIframe.contentWindow.postMessage('closeChat', '*');

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
