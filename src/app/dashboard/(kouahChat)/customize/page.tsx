import HelpDesk from "@/components/forms/helpDisk";
import React from "react";

const page = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-3.5rem)]  flex flex-col gap-3 p-5">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
          Costomize
        </h2>
        <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
          Customize your chatbot here
        </span>
      </div>
      <HelpDesk />
    </div>
  );
};

export default page;
