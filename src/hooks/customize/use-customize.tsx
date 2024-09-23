"use client";
import { useCallback, useEffect, useState } from "react";
import { ChatbotType, useGetChatbot } from "../chatbot/use-chatbot";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoFormSchema, LogoFormType } from "@/schemas/customize.schema";
import { useUploadThing } from "@/lib/uploadThing";
import { updateLogoForm } from "@/actions/customize";
import { toast } from "../use-toast";
import { useForm } from "react-hook-form";

export const useCustomize = () => {
  const [loading, setLoading] = useState(false);
  const { chatbot, setActions } = useGetChatbot();
  const [copyChatbot, setCopy] = useState<ChatbotType>();
  const [localLogo, setLocalLogo] = useState("");
  const { startUpload } = useUploadThing("logoUploader");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LogoFormType>({
    resolver: zodResolver(LogoFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (chatbot) {
      reset({
        placeHolder: chatbot.placeHolder || "",
        suggestQ: chatbot.suggestQ?.join("\n") || "",
        initialMessage: chatbot.initialMessage || "",
      });
    }
    if (chatbot && !copyChatbot) {
      setCopy(chatbot);
    }
  }, [chatbot, reset]);

  const handleCustomizeLogo = handleSubmit(async (values) => {
    // alert(JSON.stringify(values));
    // console.log({ values, nn: values.initialMessage });

    setLoading(true);
    let logoUrl;
    if (values.logo?.[0]) {
      const uploaded = await startUpload([values.logo[0]]);
      logoUrl = uploaded && uploaded[0].url;
    }
    const response = await updateLogoForm(chatbot.id, {
      ...values,
      logo: logoUrl,
      suggestQ: values.suggestQ || "",
      placeHolder: values.placeHolder || "",
      initialMessage: values.initialMessage || "",
    });
    toast({
      title: response.code === 200 ? "Success" : "Error",
      description: response.message,
      variant: response.code === 200 ? "default" : "destructive",
    });
    setActions((prev) => prev + 1);
    setLoading(false);
  });
  const watchLogo = watch("logo");

  useEffect(() => {
    if (watchLogo?.[0]) {
      const newLogoUrl = URL.createObjectURL(watchLogo[0]);
      setLocalLogo(newLogoUrl ?? "");

      return () => {
        URL.revokeObjectURL(newLogoUrl);
      };
    }
  }, [watchLogo]);

  const getUpdatedChatbot = useCallback(() => {
    if (!chatbot) return null;

    return {
      ...chatbot,
      placeHolder: watch("placeHolder"),
      suggestQ: watch("suggestQ")?.split("\n"),
      initialMessage: watch("initialMessage"),
      logo: localLogo || chatbot.logo,
    };
  }, [chatbot, watch, localLogo]);

  useEffect(() => {
    const updatedChatbot = getUpdatedChatbot();
    setCopy(updatedChatbot);
  }, [
    watch("placeHolder"),
    watch("suggestQ"),
    watch("initialMessage"),
    localLogo,
  ]);

  return {
    loading,
    register,
    errors,
    setValue,
    watch,
    handleCustomizeLogo,
    chatbot: copyChatbot,
  };
};

export type useCustomizeTypes = ReturnType<typeof useCustomize>;
