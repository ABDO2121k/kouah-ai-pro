"use client";

import { useEffect, useState } from "react";
import { useGetChatbot } from "../chatbot/use-chatbot";
import { deleteFileDb, deleteMultipleFilesDb, rebuild } from "@/actions/files";
import { toast } from "../use-toast";

export type FileType = {
  id: string;
  fileName: string | null;
  size: bigint | null;
  type: string;
  key: string | null;
  chatBotId: string | null;
  url: string | null;
  step: string;
};

export const useGetFiles = () => {
  const { chatbot, setActions } = useGetChatbot();
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [buildLoading, setBuildLoading] = useState(false);

  useEffect(() => {
    if (chatbot?.files) {
      setFiles(chatbot.files);
    }
  }, [chatbot]);

  const deleteFile = async (id: string) => {
    setLoading(true);
    setSelectedFiles([id]);
    const response = await deleteFileDb(chatbot?.id, id);
    toast({
      title: response.status == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.status == 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    setLoading(false);
    setSelectedFiles([]);
  };
  const deleteMultiFiles = async () => {
    setLoading(true);
    const response = await deleteMultipleFilesDb(chatbot?.id, selectedFiles);
    toast({
      title: response.status == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.status == 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    setLoading(false);
    setSelectedFiles([]);
  };

  const Rebuild = async () => {
    setBuildLoading(true);
    const response = await rebuild(chatbot?.id);
    toast({
      title: response.status == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.status == 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    setBuildLoading(false);
    setSelectedFiles([]);
  };
  return {
    files,
    deleteFile,
    selectedFiles,
    setSelectedFiles,
    loading,
    deleteMultiFiles,
    chatbot,
    Rebuild,
    buildLoading,
  };
};
