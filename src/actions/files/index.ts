"use server";

import { db } from "@/lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "langchain/document";
import * as cheerio from "cheerio";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export interface FileUpload {
  fileName: string;
  size: bigint | null;
  type: string;
  key: string | null;
  url: string | null;
  step?: string | null;
  fileType?: string | null;
}

export const uploadFile = async (bot: string | undefined, file: FileUpload) => {
  try {
    const createdFile = await db.file.create({
      data: {
        fileName: file.fileName,
        key: file.key,
        size: file.size,
        chatBotId: bot,
        url: file.url,
        fileType: file.fileType,
      },
    });
    if (createdFile) {
      await db.chatBot.update({
        where: { id: bot },
        data: {
          fileUsage: {
            increment: file.size ?? 0,
          },
        },
      });
    }

    return { status: 200, message: "file uploaded with success", createdFile };
  } catch (err) {
    console.error("Error uploading file:", err);
    return { status: 500, message: "External server error", createdFile: null };
  }
};

// async function loadImage(url: string): Promise<Document[]> {
//   const worker = await createWorker('eng',1,{workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js"});  const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//   console.log(ret.data.text);
//   await worker.terminate();
//   console.log({ pageContent: ret.data.text });
//   return [new Document({ pageContent: ret.data.text })];
// }

async function loadHTML(blob: Blob): Promise<Document[]> {
  const text = await blob.text();
  const $ = cheerio.load(text);
  const content = $("body").text().trim();
  return [new Document({ pageContent: content })];
}

export const storePinecone = async (bot: string, file: FileUpload) => {
  try {
    const response = await fetch(file?.url ?? "");
    const blob = await response.blob();
    let documents: Document[];

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.Index("kouah-ai");

    switch (file.fileType) {
      case "application/pdf":
        const pdfLoader = new PDFLoader(blob);
        documents = await pdfLoader.load();
        break;
      case "text/plain":
        const textLoader = new TextLoader(blob);
        documents = await textLoader.load();
        break;
      case "text/html":
        documents = await loadHTML(blob);
        break;
      case "text/csv":
        const csvLoader = new CSVLoader(blob);
        documents = await csvLoader.load();
        break;
      // case "image/jpeg":
      // case "image/png":
      // case "image/jpg":
      //   documents = await loadImage(file.url);
      //   break;
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY_A,
    });

    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex,
      namespace: bot,
    });
    console.log("file stored with success");
    return { status: 200, message: "File processed and stored with success" };
  } catch (err) {
    console.error("Error storing in Pinecone:", err);
    return { status: 500, message: "External server error" };
  }
};

export const uploadFiles = async (
  bot: string,
  files: FileUpload[],
  NotAddVector?: boolean //drtha 3la 7sab upload files only
) => {
  try {
    for (const file of files) {
      const createdFile = await uploadFile(bot, file);
      if ("status" in createdFile && createdFile.status === 500) {
        throw new Error(createdFile.message);
      }
      if (NotAddVector !== true) {
        const response = await storePinecone(bot, file);
        if (response.status == 200) {
          await UpdateFileState(
            createdFile.createdFile?.id ?? "unknown",
            "SUCCESS"
          );
        } else {
          await UpdateFileState(
            createdFile.createdFile?.id ?? "unknown",
            "Failed"
          );
        }
      }
    }
    return {
      status: 200,
      message: "Files uploaded and processed successfully",
    };
  } catch (err) {
    console.error("Error uploading files:", err);
    return { status: 500, message: "External server error" };
  }
};

export const removePinecone = async (namespace: string) => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.Index("kouah-ai");

    pineconeIndex.namespace(namespace).deleteAll();

    console.log(
      `All vectors in namespace ${namespace} successfully deleted from Pinecone index.`
    );
    return {
      status: 200,
      message: "Vectors in namespace successfully deleted from Pinecone",
    };
    //eslint-disable-next-line
  } catch (err: any) {
    // console.error("Error deleting vectors from Pinecone:", err);
    return { status: 500, message: err.message };
  }
};

export const UpdateFileState = async (fileId: string, step: string) => {
  await db.file.update({
    where: {
      id: fileId,
    },
    data: {
      step: step,
    },
  });
};

const loadHTMLContent = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const text = await blob.text();
  const $ = cheerio.load(text);
  return $("body").text().trim();
};

const getYoutubeContent = async (url: string) => {
  console.log(`Fetching YouTube content for URL: ${url}`);
  try {
    const loader = YoutubeLoader.createFromUrl(url, {
      addVideoInfo: true,
      detectLanguage: true,
    } as any);

    const docs = await loader.load();

    if (docs.length === 0) {
      console.warn(`No content found for URL: ${url}`);
      return ""; // Handle as needed
    }

    return docs.map((doc) => doc.pageContent).join("\n");
    //eslint-disable-next-line
  } catch (error: any) {
    console.error("Error loading YouTube content:", error);
    if (error.message.includes("Transcript is disabled")) {
      console.warn("Transcript is disabled for this video.");
      return ""; // Return empty string or handle as needed
    }
    return null; // Return null or handle the error as needed
  }
};

export const uploadUrls = async (
  bot: string,
  urls: string[],
  type: "web" | "youtube",
  NotAddVector?: boolean
) => {
  try {
    for (const url of urls) {
      let content: string | null = null;
      const createdFile = await db.file.create({
        data: {
          type: type,
          fileName: url,
          chatBotId: bot,
        },
      });
      if (type === "web") {
        if (NotAddVector !== true) {
          content = await loadHTMLContent(url);
        }
        await db.chatBot.update({
          where: { id: bot },
          data: {
            webUsage: {
              increment: 1,
            },
          },
        });
      } else if (type === "youtube") {
        if (NotAddVector !== true) {
          content = (await getYoutubeContent(url)) ?? null;
        }
        await db.chatBot.update({
          where: { id: bot },
          data: {
            videosUsage: {
              increment: 1,
            },
          },
        });
      } else {
        throw new Error(`Unsupported type: ${type}`);
      }
      if (NotAddVector !== true) {
        if (content !== null) {
          const response = await storeUrlPinecone(bot, content);
          if (response.status == 200) {
            await UpdateFileState(createdFile?.id ?? "unknown", "SUCCESS");
          } else {
            await UpdateFileState(createdFile?.id ?? "unknown", "Failed");
          }
        } else {
          await UpdateFileState(createdFile?.id ?? "unknown", "Failed");
        }
      }
    }
    return {
      status: 200,
      message: "Urls uploaded and processed successfully",
    };
  } catch (err) {
    console.error("Error uploading files:", err);
    return { status: 500, message: "External server error" };
  }
};

export const storeUrlPinecone = async (bot: string, text: string) => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.Index("kouah-ai");

    // Create a text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // Split the text into chunks
    const chunks = await textSplitter.splitText(text);

    // Create documents from chunks
    const documents = chunks.map(
      (chunk) => new Document({ pageContent: chunk })
    );

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY_A,
    });

    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex,
      namespace: bot,
    });
    console.log("Content stored with success");
    return {
      status: 200,
      message: "Content processed, chunked, and stored with success",
    };
  } catch (err) {
    console.error("Error storing in Pinecone:", err);
    return { status: 500, message: "External server error" };
  }
};

const updateChatBotUsage = async (
  bot: string | undefined,
  file: { type: string; size?: bigint }
) => {
  const updateData: {
    videosUsage?: { decrement: number };
    fileUsage?: { decrement: number };
    webUsage?: { decrement: number };
  } = {};

  switch (file.type) {
    case "youtube":
      updateData.videosUsage = { decrement: 1 };
      break;
    case "file":
      if (file.size) {
        updateData.fileUsage = { decrement: Number(file.size) }; // Assuming size is a BigInt
      }
      break;
    case "web":
      updateData.webUsage = { decrement: 1 };
      break;
    default:
      throw new Error(`Unsupported file type: ${file.type}`);
  }

  await db.chatBot.update({
    where: { id: bot },
    data: updateData,
  });
};

export const deleteFileDb = async (bot: string | undefined, fileId: string) => {
  try {
    const fileToDelete = await db.file.findUnique({
      where: { id: fileId },
    });

    if (!fileToDelete) {
      return { status: 404, message: "File not found" };
    }

    await db.file.delete({
      where: { id: fileId },
    });

    await updateChatBotUsage(bot, {
      type: fileToDelete.type,
      size: fileToDelete.size ?? undefined,
    });

    return { status: 200, message: "File deleted successfully" };
  } catch (err) {
    console.error("Error deleting file:", err);
    return { status: 500, message: "External server error" };
  }
};

export const deleteMultipleFilesDb = async (
  bot: string | undefined,
  fileIds: string[]
) => {
  try {
    const filesToDelete = await db.file.findMany({
      where: { id: { in: fileIds } },
    });

    await db.file.deleteMany({
      where: { id: { in: fileIds } },
    });

    for (const file of filesToDelete) {
      await updateChatBotUsage(bot, {
        type: file.type,
        size: file.size ?? undefined,
      });
    }

    return { status: 200, message: "Files deleted successfully" };
  } catch (err) {
    console.error("Error deleting multiple files:", err);
    return { status: 500, message: "External server error" };
  }
};

export const rebuild = async (chatbotId: string) => {
  try {
    await removePinecone(chatbotId);

    const files = await db.file.findMany({
      where: { chatBotId: chatbotId },
    });
    if (files.length > 0) {
      for (const file of files) {
        let response;
        if (file.type === "youtube") {
          const content = (await getYoutubeContent(file.fileName ?? "")) ?? "";
          response = (await storeUrlPinecone(chatbotId, content)) ?? "";
          console.log({ response });
        } else if (file.type === "web") {
          const content = await loadHTMLContent(file.fileName ?? "");
          if (content) {
            response = await storeUrlPinecone(chatbotId, content);
          }
        } else if (file.type === "file") {
          response = await storePinecone(chatbotId, file);
        } else {
          console.warn(`Unsupported file type: ${file.type}`);
        }
        if (response && response.status == 200) {
          await UpdateFileState(file.id ?? "unknown", "SUCCESS");
        } else {
          await UpdateFileState(file.id ?? "unknown", "Failed");
        }
      }
    }

    return { status: 200, message: "Chatbot files rebuilt successfully" };
  } catch (err) {
    console.error("Error rebuilding chatbot files:", err);
    return { status: 500, message: "External server error" };
  }
};
