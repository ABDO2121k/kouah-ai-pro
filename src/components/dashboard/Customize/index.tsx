"use client";
import { CustomizeProvider } from "@/context/use-customize-context";
import React from "react";
import CustomizeComponent from "./Customize";
import { DrawerBot } from "@/components/drawer/bot";
import { CustomizethemeProvider } from "@/context/use-theme-context";

const Customize = () => {
  return (
    <CustomizeProvider>
      <CustomizethemeProvider>
        <div className="overflow-y-auto h-[calc(100vh-3.5rem)] w-full  flex flex-col gap-3 p-5 pb-20">
          <div className="flex flex-col gap-2 p-5 w-full">
            <div className="flex justify-between items-center gap-2 w-full ">
              <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
                Customize
              </h2>
              <div className="block lg:hidden  md:block sm:block">
                <DrawerBot />
              </div>
            </div>
            <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
              Customize your chatbot here
            </span>
          </div>
          <CustomizeComponent />
        </div>
      </CustomizethemeProvider>
    </CustomizeProvider>
  );
};

export default Customize;
