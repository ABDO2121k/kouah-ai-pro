-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('FREE', 'STANDARD', 'PRO', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeId" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plan" "Plans" NOT NULL DEFAULT 'FREE',
    "credits" INTEGER NOT NULL DEFAULT 10,
    "userId" UUID,
    "queriesNumber" INTEGER NOT NULL DEFAULT 0,
    "lastPaymentDate" TIMESTAMP(3),

    CONSTRAINT "Billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadField" (
    "id" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "chatBotId" TEXT,

    CONSTRAINT "LeadField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "size" BIGINT,
    "type" TEXT NOT NULL DEFAULT 'file',
    "fileType" TEXT,
    "key" TEXT,
    "chatBotId" TEXT,
    "url" TEXT,
    "step" TEXT DEFAULT 'PENDING',

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatBotId" TEXT,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatBotLeadsData" (
    "id" TEXT NOT NULL,
    "fieldName" TEXT,
    "value" TEXT,
    "isShow" BOOLEAN NOT NULL DEFAULT false,
    "leadId" TEXT,

    CONSTRAINT "ChatBotLeadsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatBotLeads" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatBotId" TEXT,

    CONSTRAINT "ChatBotLeads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatBot" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL DEFAULT 'files',
    "assistantId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Your chatbot title',
    "subTitle" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "logo" TEXT NOT NULL DEFAULT '',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "leads" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'arabic',
    "initialMessage" TEXT NOT NULL DEFAULT 'Hello, how can I help you?',
    "suggestQ" TEXT[] DEFAULT ARRAY['I wnat to talk to manager !!!']::TEXT[],
    "placeHolder" TEXT NOT NULL DEFAULT 'Type your question here...',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,
    "leadsTitle" TEXT NOT NULL DEFAULT 'Tell us how to reach you',
    "queriesNumber" INTEGER NOT NULL DEFAULT 0,
    "isRealTimeChat" BOOLEAN NOT NULL DEFAULT false,
    "isHelpDisk" BOOLEAN NOT NULL DEFAULT false,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "videosUsage" INTEGER NOT NULL DEFAULT 0,
    "fileUsage" BIGINT NOT NULL DEFAULT 0,
    "webUsage" INTEGER NOT NULL DEFAULT 0,
    "useTheme" BOOLEAN NOT NULL DEFAULT false,
    "chatbotThemeId" TEXT,
    "buttonBackground" TEXT DEFAULT '#ffff',
    "buttonImage" TEXT,
    "buttonFullBg" BOOLEAN NOT NULL DEFAULT false,
    "useCustomButton" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChatBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotTheme" (
    "id" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "containerBackground" TEXT NOT NULL DEFAULT '#FFFFFF',
    "borderColor" TEXT NOT NULL DEFAULT '#E2E8F0',
    "primaryTextColor" TEXT NOT NULL DEFAULT '#F8FAFC',
    "primaryBackground" TEXT NOT NULL DEFAULT '#2563EB',
    "botMessageTextColor" TEXT NOT NULL DEFAULT '#020817',
    "botMessageBackground" TEXT NOT NULL DEFAULT '#F1F5F9',
    "suggestedQuestionTextColor" TEXT NOT NULL DEFAULT '#020817',
    "suggestedQuestionBackground" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textColor" TEXT NOT NULL DEFAULT '#020817',
    "textBackground" TEXT NOT NULL DEFAULT '#F1F5F9',
    "placeholderTextColor" TEXT NOT NULL DEFAULT '#64748B',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatbotTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpDesk" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "chatBotId" TEXT NOT NULL,

    CONSTRAINT "HelpDesk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "live" BOOLEAN DEFAULT false,
    "chatRead" BOOLEAN DEFAULT false,
    "mailed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "chatBotId" TEXT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message" TEXT NOT NULL,
    "role" "Role",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatRoomId" UUID,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "isImage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeId_key" ON "User"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Billings_userId_key" ON "Billings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatBot_chatbotThemeId_key" ON "ChatBot"("chatbotThemeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotTheme_chatbotId_key" ON "ChatbotTheme"("chatbotId");

-- AddForeignKey
ALTER TABLE "Billings" ADD CONSTRAINT "Billings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadField" ADD CONSTRAINT "LeadField_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBotLeadsData" ADD CONSTRAINT "ChatBotLeadsData_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "ChatBotLeads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBotLeads" ADD CONSTRAINT "ChatBotLeads_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBot" ADD CONSTRAINT "ChatBot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBot" ADD CONSTRAINT "ChatBot_chatbotThemeId_fkey" FOREIGN KEY ("chatbotThemeId") REFERENCES "ChatbotTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpDesk" ADD CONSTRAINT "HelpDesk_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
