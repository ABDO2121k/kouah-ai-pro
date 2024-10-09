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
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export interface FileUpload {
  name: string;
  size: number;
  key: string;
  lastModified: number;
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
        size: file.size,
        chatBotId: bot,
        url: file.url,
      },
    });
    if (createdFile) {
      await db.chatBot.update({
        where: { id: bot },
        data: {
          fileUsage: {
            increment: file.size,
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
    console.log("file stored with success");
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
  const loader = YoutubeLoader.createFromUrl(url, {
    addVideoInfo: true,
    detectLanguage: true,
    //eslint-disable-next-line
  } as any);
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
};
export const uploadUrls = async (
  bot: string,
  urls: string[],
  type: "web" | "youtube"
) => {
  try {
    for (const url of urls) {
      let content: string;
      const createdFile = await db.file.create({
        data: {
          type: type,
          fileName: url,
        },
      });
      if (type === "web") {
        content = await loadHTMLContent(url);
        await db.chatBot.update({
          where: { id: bot },
          data: {
            webUsage: {
              increment: 1,
            },
          },
        });
      } else if (type === "youtube") {
        content = await getYoutubeContent(url);
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

      const response = await storeUrlPinecone(bot, content);
      if (response.status == 200) {
        await UpdateFileState(createdFile?.id ?? "unknown", "SUCCESS");
      } else {
        await UpdateFileState(createdFile?.id ?? "unknown", "Failed");
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
