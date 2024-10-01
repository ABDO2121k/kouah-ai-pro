import GeneraleForm from "@/components/forms/generale/generale-form";
import HelpDesk from "@/components/forms/helpDisk";
import React from "react";

const page = () => {

  return (
    <div className="flex flex-col gap-3 p-5 h-full max-h-[calc(100vh-3.5rem)] overflow-y-auto  pb-20">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
          Generale
        </h2>
        <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
          Update your chatbot profile here
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <GeneraleForm />
        <HelpDesk />
      </div>
    </div>
  );
};

export default page;
