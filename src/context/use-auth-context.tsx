"use client"
import React, { createContext, useContext, useState } from "react";

type InitialValuesProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const InitialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
};

const authContext = createContext(InitialValues);

const { Provider } = authContext;

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(InitialValues.currentStep);
   const value={
    currentStep,
    setCurrentStep
   }
  return <Provider value={value}>{children}</Provider>;
};

// swbna db context anrdoh 3la xkl hook

export const useAuthContext=()=>{
    const state=useContext(authContext)
    return state
}