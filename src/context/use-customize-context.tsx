"use client";

import React, { createContext, useContext } from "react";
import { useCustomize } from "@/hooks/customize/use-customize";
import { ChatbotType } from "@/hooks/chatbot/use-chatbot";

interface CustomizeContextType {
  loading: boolean;
  //eslint-disable-next-line
  register: any;
  //eslint-disable-next-line
  errors: any;
  handleCustomizeLogo: () => void;
  chatbot: ChatbotType | null;
  //eslint-disable-next-line
  watch: any;
  //eslint-disable-next-line
  control: any;
}

const initialCustomizeContextValue: CustomizeContextType = {
  loading: false,
  register: () => ({}),
  errors: {},
  handleCustomizeLogo: () => {},
  chatbot: null,
  watch: () => ({}),
  control: () => ({}),
};

const CustomizeContext = createContext<CustomizeContextType>(
  initialCustomizeContextValue
);

export const CustomizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    loading,
    register,
    errors,
    handleCustomizeLogo,
    chatbot,
    watch,
    control,
  } = useCustomize();

  return (
    <CustomizeContext.Provider
      // eslint-disable-next-line
      value={{
        loading,
        register,
        errors,
        handleCustomizeLogo,
        chatbot: chatbot as ChatbotType | null,
        watch,
        control,
      }}
    >
      {children}
    </CustomizeContext.Provider>
  );
};

export const useCustomizeContext = () => useContext(CustomizeContext);
