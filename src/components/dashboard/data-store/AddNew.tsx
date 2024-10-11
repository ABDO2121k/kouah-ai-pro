"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddFile from "./AddFile";
import WebUrlUploader from "@/components/botCreation/Web";

const AddNew = ({ chatbotId }: { chatbotId: string }) => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add New Record
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="flex flex-col">
            <Button variant="outline" onClick={() => setOpenDialog("file")}>
              Add File
            </Button>
            <Button variant="outline" onClick={() => setOpenDialog("web")}>
              Add Web
            </Button>
            <Button variant="outline" onClick={() => setOpenDialog("youtube")}>
              Add YouTube
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {openDialog && (
        <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-h-[70%] overflow-y-auto">
            <DialogHeader>
              {/* <DialogTitle>
                {openDialog === "file" && "Add New File"}
                {openDialog === "web" && "Add New Web Record"}
                {openDialog === "youtube" && "Add New YouTube Record"}
              </DialogTitle> */}
            </DialogHeader>
            {openDialog === "file" && <AddFile chatbotId={chatbotId} />}
            {openDialog === "web" && (
              <WebUrlUploader
                type="web"
                chatbotId={chatbotId}
                NotAddVector={true}
              />
            )}
            {openDialog === "youtube" && (
              <WebUrlUploader
                type="youtube"
                chatbotId={chatbotId}
                NotAddVector={true}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddNew;
