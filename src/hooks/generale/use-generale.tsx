"use client";

import { generaleSchema, GeneraleTypes } from "@/schemas/generale-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateGenerale } from "@/actions/generale";
import { toast } from "../use-toast";
import { useGetChatbot } from "../chatbot/use-chatbot";

export const useGenerale = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { chatbot, setActions } = useGetChatbot();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneraleTypes>({
    resolver: zodResolver(generaleSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      title: "",
      isHelpDisk: false,
      isLead: false,
      isRealTimeChat: false,
    },
  });

  const changeGenerale = handleSubmit(async (values) => {
    setLoading(true);
    const response = await updateGenerale(chatbot.id, values);
    toast({
      title: response.code == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.code == 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    return setTimeout(() => {
      setLoading(false);
    }, 500);
  });
  useEffect(() => {
    if (chatbot) {
      reset({
        description: chatbot.description ?? null,
        title: chatbot.title == "Your chatbot title" ? "" : chatbot.title,
        isHelpDisk: chatbot.isHelpDisk,
        isLead: chatbot.isLead,
        isRealTimeChat: chatbot.isRealTimeChat,
      });
    }
  }, [chatbot, reset]);
  return {
    loading,
    register,
    errors,
    setValue,
    watch,
    changeGenerale,
  };
};
