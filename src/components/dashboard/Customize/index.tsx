"use client";
import LogoForm from "@/components/forms/costomize/logo-form";
import { CustomizeProvider } from "@/context/use-customize-context";
import React from "react";
import WindowPreview from "../chatWindow/windwPreview";

const Customize = () => {
  return (
    <CustomizeProvider>
      <div className="container">
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-8 p-5 sm:col-span-5">
            <LogoForm />
          </div>
          <div className="col-span-3 hidden sm:flex flex-col ">
            <WindowPreview />
          </div>
        </div>
      </div>
    </CustomizeProvider>
  );
};

export default Customize;
