# Kouah AI — multi-tenant AI chatbot SaaS

Businesses create their own AI agent, train it on their content, customise it and embed it on their website in a few lines. Every bot belongs to one tenant, with its own data store, leads, conversations and billing.

Built and run since 2024 (87 commits). The embed SDK is published on npm as [`@kouahai/embed`](https://www.npmjs.com/package/@kouahai/embed) (1,400+ downloads).

## Features

- **Bot builder**: create a bot, set its behaviour and theme, preview it live
- **Knowledge base / RAG**: upload files (UploadThing), chunk and embed them with LangChain + OpenAI, store vectors in Pinecone, and ground every answer in the tenant's own content
- **Embeddable widget**: iframe/button endpoints (`/api/frame`, `/api/iframe`, `/embed/[chatbotId]`) and the npm SDK
- **Lead capture**: configurable lead fields collected by the bot
- **Help desk and real-time conversations**: live chat rooms with Socket.IO so a human can take over
- **Query log**: every question and answer, per bot
- **Billing**: Stripe Checkout and Stripe webhooks for plans
- **Auth**: NextAuth (Google OAuth + credentials)

## Stack

Next.js 14 (App Router), TypeScript, Prisma + PostgreSQL, LangChain, OpenAI API, Pinecone, Socket.IO, Stripe, NextAuth, UploadThing, Tailwind / shadcn, Docker (Bun multi-stage build), GitHub Actions (Docker build workflow).

Data model: `User`, `ChatBot`, `ChatbotTheme`, `File`, `Query`, `LeadField`, `ChatBotLeads`, `ChatBotLeadsData`, `HelpDesk`, `ChatRoom`, `ChatMessage`, `Billings`.

## Run locally

```bash
cp .env.example .env      # fill in the values
bun install               # or npm install
npx prisma migrate dev
bun run dev               # http://localhost:3000
```

Or build the container: `docker build -t kouah-ai .`
