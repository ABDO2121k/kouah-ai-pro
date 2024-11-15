import LogoForm from "@/components/forms/costomize/logo-form";
import React from "react";
import WindowPreview from "../chatWindow/preview/windwPreview";
import { useCustomizeContext } from "@/context/use-customize-context";
import ColorForm from "@/components/forms/costomize/color-form";
import ButtonForm from "@/components/forms/customize/button-form";

const CustomizeComponent = () => {
  const { chatbot, watch } = useCustomizeContext();
  const theme = watch("theme");
  return (
    <div className="container">
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-8 lg:col-span-5 md:col-span-8 sm:col-span-8 flex flex-col gap-5 h-full">
          <ButtonForm />
        </div>
        <div className="col-span-8 lg:col-span-5 md:col-span-8 sm:col-span-8 flex flex-col gap-5 h-full">
          <LogoForm />
          {theme === "customize" && <ColorForm />}
        </div>

        <div className="col-span-3 hidden lg:flex md:hidden sm:hidden flex-col h-full">
          <div className="mt-auto max-h-[35rem] mb-10">
            <WindowPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeComponent;
