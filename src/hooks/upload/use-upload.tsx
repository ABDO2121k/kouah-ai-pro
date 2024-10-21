"use client";
import { createChatBot } from "@/actions/chatbot";
import { useUploadThing } from "@/lib/uploadThing";
import { useState } from "react";
import { toast } from "../use-toast";
import { FileUpload, uploadFiles, uploadUrls } from "@/actions/files";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetChatbot } from "../chatbot/use-chatbot";
import { checkUserLimits } from "@/actions/user";
import { getCurrentUserFromDb } from "@/actions/auth";

// Add this function to check file size limits
const checkFileSizeLimits = async (
  userId: string,
  files: File[],
  bot: string
) => {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  try {
    await checkUserLimits(userId, "file", bot, files.length, BigInt(totalSize));
    return true;
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: "File size limit exceeded",
        description: error.message,
        variant: "destructive",
      });
    }
    return false;
  }
};

export const useUpload = (botId?: string, NotAddVector?: boolean) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("fileUploader");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { setActions } = useGetChatbot();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      let bot: string | undefined;
      if (!botId) {
        const createdBot = await createChatBot();
        if (createdBot.status === 200 && createdBot.chatbot) {
          bot = createdBot.chatbot.id;
        } else {
          toast({
            title: "Something went wrong",
            description: createdBot.message || "Failed to create chat bot",
            variant: "destructive",
          });
          setFiles([]);
          return setIsUploading(false);
        }
      } else {
        bot = botId;
      }

      if (!bot) {
        throw new Error("Bot ID is undefined");
      }

      // Check file size limits after upload
      const currentUser = await getCurrentUserFromDb();
      if (!currentUser) {
        throw new Error("User not found");
      }

      const isWithinLimits = await checkFileSizeLimits(
        currentUser.id,
        files,
        bot
      );
      if (!isWithinLimits) {
        throw new Error("File size limit exceeded");
      }

      const uploadedFiles = await startUpload(files);
      console.log({ uploadedFiles });
      if (!uploadedFiles) {
        throw new Error("File upload failed");
      }

      const res: FileUpload[] = uploadedFiles.map((file) => ({
        fileName: file.name,
        size: BigInt(file.size),
        key: file.key,
        url: file.url,
        lastModified: file.lastModified ?? Date.now(),
        appUrl: "",
        fileType: file.type || "",
        type: "file",
      }));

      const fileUploaded = await uploadFiles(bot, res, NotAddVector);
      setActions((prev) => prev + 1);
      toast({
        title: "Files uploaded successfully",
        description: "Your files have been uploaded and processed.",
        variant: "default",
      });
      if (NotAddVector !== true) {
        localStorage.setItem("selectedChatbot", bot);
        router.push("/dashboard/bot");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Something went wrong",
        description:
          err instanceof Error ? err.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFiles([]);
    }
  };
  return {
    files,
    handleFileUpload,
    handleUpload,
    isUploading,
  };
};

export const useUploadUrl = (
  type: "youtube" | "web",
  botId?: string,
  NotAddVector?: boolean
) => {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const router = useRouter();
  const { setActions } = useGetChatbot();

  const schema = z.object({
    url: z.string().url({ message: "Please enter a valid URL" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleAddToState = handleSubmit((values) => {
    setUrls((prevUrls) => [...prevUrls, values.url]);
    reset();
  });

  const handleAddToDB = async () => {
    setLoading(true);

    let bot: string | undefined;
    if (!botId) {
      const createdBot = await createChatBot();
      if (createdBot.status === 200 && createdBot.chatbot) {
        bot = createdBot.chatbot.id;
      } else {
        toast({
          title: "Something went wrong",
          description: createdBot.message || "Failed to create chat bot",
          variant: "destructive",
        });
        setLoading(false);
        setUrls([]);
        return;
      }
    } else {
      bot = botId;
    }

    if (!bot) {
      throw new Error("Bot ID is undefined");
    }
    const response = await uploadUrls(bot, urls, type, NotAddVector);
    toast({
      title: response.status == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.status == 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    setLoading(false);
    setUrls([]);
    if (NotAddVector !== true) {
      localStorage.setItem("selectedChatbot", bot);
      router.push("/dashboard/bot");
    }
  };

  const removeUrl = (index: number) => {
    setUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    toast({
      title: "URL Removed",
      description: `The URL has been removed successfully`,
      variant: "default",
    });
  };

  return {
    loading,
    urls,
    errors,
    register,
    handleAddToState,
    handleAddToDB,
    reset,
    watch,
    removeUrl,
  };
};
