import React from "react";
import TabsMenu from "../tabs";
import { TabsContent } from "../ui/tabs";
import { TABS_MENU } from "./data";
import { FileUploadDemo } from "./fileUpload";

const BotCreation = () => {
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex flex-col gap-3 ">
      <div className="flex flex-col flex-shrink-0 p-5 mt-3">
        <h2 className="font-bold text-4xl md:text-3xl sm:text-2xl text-black dark:text-white">
          Create Chatbot{" "}
        </h2>
        <span className="text-md text-zinc-400">
          {" "}
          Create a chatbot from different sources
        </span>
      </div>
      <TabsMenu triggers={TABS_MENU} className="mb-10 mt-5 ml-5">
        <TabsContent value="File">
          <div className="flex flex-col  gap-3 shrink-0 p-5 rounded-lg border border-zinc-600 dark:border-zinc-100 m-4">
            {/* <div className="flex flex-col flex-shrink-0 p-5 mt-3">
              <h2 className="font-bold text-2xl md:text-xl sm:text-lg text-black dark:text-white">
                Upload Files{" "}
              </h2>
              <span className="text-sm text-zinc-400">
                {" "}
                Upload files to build a chatbot
              </span>
            </div> */}
            <div className="flex flex-col flex-shrink-0 p-5 mt-3">
              <FileUploadDemo />
            </div>
          </div>
        </TabsContent>
      </TabsMenu>
    </div>
  );
};

export default BotCreation;
