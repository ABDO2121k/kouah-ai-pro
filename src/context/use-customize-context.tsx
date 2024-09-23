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
  //eslint-disable-next-line
  chatbot: ChatbotType;
}
const initialCustomizeContextValue: CustomizeContextType = {
  loading: false,
  register: () => ({}), 
  errors: {}, 
  handleCustomizeLogo: () => {},
  chatbot: null, 
};

const CustomizeContext = createContext<CustomizeContextType>(initialCustomizeContextValue);

export const CustomizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading, register, errors, handleCustomizeLogo, chatbot } =
    useCustomize();

  return (
    <CustomizeContext.Provider
      value={{ loading, register, errors, handleCustomizeLogo, chatbot }}
    >
      {children}
    </CustomizeContext.Provider>
  );
};

export const useCustomizeContext = () => useContext(CustomizeContext);
