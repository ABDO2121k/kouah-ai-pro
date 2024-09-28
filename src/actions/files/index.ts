"use server";

import { db } from "@/lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "langchain/document";
// import { createWorker  } from "tesseract.js";
import * as cheerio from "cheerio";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

export interface FileUpload {
  name: string;
  size: number;
  key: string;
  lastModified: number;
  serverData: {
    userId: string;
  };
  url: string;
  appUrl: string;
  customId: string | null;
  type: string;
}

export const uploadFile = async (bot: string | undefined, file: FileUpload) => {
  try {
    const createdFile = await db.file.create({
      data: {
        fileName: file.name,
        key: file.key,
        size: String(file.size),
        chatBotId: bot,
        url: file.url,
      },
    });
    return createdFile;
  } catch (err) {
    console.error("Error uploading file:", err);
    return { status: 500, message: "External server error" };
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
    const response = await fetch(file.url);
    const blob = await response.blob();
    let documents: Document[];

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.Index("kouah-ai");

    switch (file.type) {
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
    console.log("file stored with success")
    return { status: 200, message: "File processed and stored with success" };
  } catch (err) {
    console.error("Error storing in Pinecone:", err);
    return { status: 500, message: "External server error" };
  }
};

export const uploadFiles = async (bot: string, files: FileUpload[]) => {
  try {
    for (const file of files) {
      const createdFile = await uploadFile(bot, file);
      if ("status" in createdFile && createdFile.status === 500) {
        throw new Error(createdFile.message);
      }
      await storePinecone(bot, file);
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
  } catch (err) {
    console.error("Error deleting vectors from Pinecone:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unknown error occurred"
    );
  }
};
