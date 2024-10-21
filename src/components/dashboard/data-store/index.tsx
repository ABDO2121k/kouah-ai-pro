"use client";

import React from "react";
import DataStoreTable from "./data-store-table";
import { useGetFiles } from "@/hooks/files/use-get-files";
import { Loader2, BarChart2, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  calculateUsagePercentage,
  formatFileSize,
  getBarColor,
  getUserPlan,
} from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import CustomProgress from "@/components/progress";

const DataStore = () => {
  const {
    files,
    deleteFile,
    selectedFiles,
    setSelectedFiles,
    loading,
    deleteMultiFiles,
    buildLoading,
    Rebuild,
    chatbot,
  } = useGetFiles();

  const userPlan = getUserPlan(chatbot?.User);

  return (
    <div className="flex flex-col gap-3 p-5 h-full max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-20">
      <div className="flex flex-col gap-2 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
            Data store
          </h2>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Usage
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">
                      Files: {formatFileSize(BigInt(chatbot?.fileUsage ?? 0))} /{" "}
                      {formatFileSize(
                        BigInt(userPlan.features.maxStoragePerBot)
                      )}
                    </p>
                   
                    <CustomProgress
                      percentage={calculateUsagePercentage(
                        chatbot?.fileUsage ?? 0,
                        userPlan.features.maxStoragePerBot
                      )}
                      backgroundColor="bg-gray-200"
                      fillColor={getBarColor(
                        calculateUsagePercentage(
                          chatbot?.fileUsage ?? 0,
                          userPlan.features.maxStoragePerBot
                        )
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">
                      Web Pages: {chatbot?.webUsage ?? 0} /{" "}
                      {userPlan.features.maxWebPages}
                    </p>
                     <CustomProgress
                      percentage={calculateUsagePercentage(
                        chatbot?.webUsage ?? 0,
                        userPlan.features.maxWebPages
                      )}
                      backgroundColor="bg-gray-200"
                      fillColor={getBarColor(
                        calculateUsagePercentage(
                          chatbot?.webUsage ?? 0,
                          userPlan.features.maxWebPages
                        )
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">
                      YouTube: {chatbot?.videosUsage ?? 0} /{" "}
                      {userPlan.features.maxYoutube}
                    </p>
                    <Progress
                      value={calculateUsagePercentage(
                        chatbot?.videosUsage ?? 0,
                        userPlan.features.maxYoutube
                      )}
                      color={getBarColor(
                        calculateUsagePercentage(
                          chatbot?.videosUsage ?? 0,
                          userPlan.features.maxYoutube
                        )
                      )}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rebuild
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rebuild Confirmation</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to rebuild?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="default" size="sm" onClick={Rebuild}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Confirm Rebuild
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {!buildLoading ? (
        <div className="flex flex-col gap-5">
          <DataStoreTable
            useGetFilesProps={{
              files,
              deleteFile,
              selectedFiles,
              setSelectedFiles,
              loading,
              deleteMultiFiles,
              chatbot,
              buildLoading,
              Rebuild,
            }}
          />
          <div
            className="relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 bg-muted mt-8 space-x-2"
            role="alert"
          >
            <div className="mb-4 flex flex-row items-center gap-4">
              <AlertCircle className="size-6" />
              <h5 className="font-medium leading-none tracking-tight mb-0">
                Edit Data Store & Rebuild Chatbot
              </h5>
            </div>
            <div className="text-sm [&_p]:leading-relaxed text-muted-foreground">
              <ul className="pl-4 pt-1">
                <li className="list-disc">
                  Add more web pages or files to your chatbot&apos;s data store,
                  as long as you are within the quota.
                </li>
                <li className="list-disc">
                  Use checkbox to exclude data records that are not no longer
                  required for your chatobot.
                </li>
                <li className="list-disc">
                  Rebuild chatbot after saving data store changes.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-5">
          <span className="text-lg font-semibold">Rebuilding...</span>
          <Loader2 className="loader mt-2 h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default DataStore;
