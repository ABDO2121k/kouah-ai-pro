"use client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useUpload } from "@/hooks/upload/use-upload";
import { Loader2 } from "lucide-react";
import React from "react";

const AddFile = ({ chatbotId }: { chatbotId: string }) => {
  const { handleFileUpload, handleUpload, isUploading } = useUpload(
    chatbotId,
    true
  );
  return (
    <div className="w-full max-w-4xl mx-auto min-h-50 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <Button
        type="button"
        onClick={handleUpload}
        variant={"outline"}
        className="border border-zinc-900/75 dark:border-white rounded-md my-auto mt-5"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
      </Button>
    </div>
  );
};

export default AddFile;
