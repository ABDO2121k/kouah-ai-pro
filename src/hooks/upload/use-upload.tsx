"use client";
import { createChatBot } from "@/actions/chatbot";
import { useUploadThing } from "@/lib/uploadThing";
import { useState } from "react";
import { toast } from "../use-toast";
import { FileUpload, uploadFiles } from "@/actions/files";
import { useRouter } from "next/navigation";

export const useUpload = (botId?: string) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("fileUploader");
  const [isUploading, setIsUploading] = useState(false);
  const router=useRouter()

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const uploadedFiles = await startUpload(files);

      if (!uploadedFiles) {
        throw new Error("File upload failed");
      }

      const res: FileUpload[] = uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        key: file.key,
        url: file.url,
        serverData: {
          userId: file.serverData.userId || "",
        },
        lastModified: file.lastModified ?? Date.now(),
        appUrl: "",
        customId: file.customId || null,
        type: file.type || "",
      }));

      let bot: string | undefined;
      if (!botId) {
        const createdBot = await createChatBot();
        console.log({ createdBot });
        if (createdBot.status === 200 && createdBot.chatbot) {
          bot = createdBot.chatbot.id;
        } else {
          toast({
            title: "Something went wrong",
            description: createdBot.message || "Failed to create chat bot",
            variant: "destructive",
          });
          return;
        }
      } else {
        bot = botId;
      }

      if (!bot) {
        throw new Error("Bot ID is undefined");
      }

      // console.log({ res });
      const fileUploaded = await uploadFiles(bot, res);
      // console.log({ fileUploaded });

      toast({
        title: "Files uploaded successfully",
        description: "Your files have been uploaded and processed.",
        variant: "default",
      });
      localStorage.setItem("selectedChatbot", bot);
      router.push("/dashboard/bot");
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  return {
    files,
    handleFileUpload,
    handleUpload,
    isUploading,
  };
};
