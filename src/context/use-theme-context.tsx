"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {  useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import {
  getChatbotTheme,
  ThemeType,
  updateThemeForm,
} from "@/actions/customize";
import { ThemeFormType, ThemFormSchema } from "@/schemas/customize.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

interface CustomizeContextType {
  loading: boolean;
  //eslint-disable-next-line
  register: any;
  //eslint-disable-next-line
  errors: any;
  //eslint-disable-next-line
  watch: any;
  //eslint-disable-next-line
  control: any;
  handleCustomizeTheme: () => void;
  theme: ThemeType | null;
}

const initialCustomizeContextValue: CustomizeContextType = {
  loading: false,
  register: () => ({}),
  errors: {},
  watch: () => ({}),
  control: () => ({}),
  handleCustomizeTheme: () => {},
  theme: null,
};

const CustomizeThemeContext = createContext<CustomizeContextType>(
  initialCustomizeContextValue
);

export const CustomizethemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const { chatbot } = useGetChatbot();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ThemeFormType>({
    resolver: zodResolver(ThemFormSchema),
    mode: "onChange",
  });

  const handleCustomizeTheme = handleSubmit(async (values) => {
    setLoading(true);
    const response = await updateThemeForm(chatbot.id, { ...values });
    toast({
      title: response?.code === 200 ? "Success" : "Error",
      description: response.message,
      variant: response?.code === 200 ? "default" : "destructive",
    });
    setLoading(false);
  });
  const getTheme = async () => {
    setLoading(true)
    const response = await getChatbotTheme(chatbot?.id);
    if (response &&response.code == 200) {
      reset({
        ...response.theme,
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setLoading(false)
  };
  useEffect(() => {
    if (chatbot) getTheme();
  }, [chatbot]);

  const theme = {
    containerBackground: watch("containerBackground"),
    borderColor: watch("borderColor"),
    primaryTextColor: watch("primaryTextColor"),
    primaryBackground: watch("primaryBackground"),
    botMessageTextColor: watch("botMessageTextColor"),
    botMessageBackground: watch("botMessageBackground"),
    suggestedQuestionTextColor: watch("suggestedQuestionTextColor"),
    suggestedQuestionBackground: watch("suggestedQuestionBackground"),
    textColor: watch("textColor"),
    textBackground: watch("textBackground"),
    placeholderTextColor: watch("placeholderTextColor"),
  };
  return (
    <CustomizeThemeContext.Provider
      // eslint-disable-next-line
      value={{
        loading,
        register,
        errors,
        watch,
        control,
        handleCustomizeTheme,
        theme,
      }}
    >
      {children}
    </CustomizeThemeContext.Provider>
  );
};

export const useCustomizeThemeContext = () => useContext(CustomizeThemeContext);
