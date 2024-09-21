"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useUpload } from "@/hooks/upload/use-upload";
import { Button } from "../ui/button";
import { Loader } from "../loader";

export function FileUploadDemo() {
  const { handleFileUpload, handleUpload, isUploading } = useUpload();
  return (
    <div className="w-full max-w-4xl mx-auto min-h-50 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <Loader loading={isUploading}>
        <Button
          type="button"
          onClick={handleUpload}
          variant={"outline"}
          className="border border-zinc-900/75 dark:border-white rounded-md my-auto mt-5"
        >
          Upload
        </Button>
      </Loader>
    </div>
  );
}
