"use client";

import React from "react";
import DataStoreTable from "./data-store-table";
import { useGetFiles } from "@/hooks/files/use-get-files";
import { Loader2 } from "lucide-react";
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
import { BarChart2, RefreshCw, X } from "lucide-react";
import { pricingPackages } from "@/data/packages";
import { formatFileSize } from "@/lib/utils";

const DataStore = () => {
  const { files, deleteFile, selectedFiles, setSelectedFiles, loading, deleteMultiFiles, buildLoading, Rebuild,chatbot } = useGetFiles();

  const getUserPlan = () => {
    const planName = chatbot?.User.subscription?.plan || "FREE";
    return pricingPackages.find(pkg => pkg.indication === planName) || pricingPackages[0];
  };

  const userPlan = getUserPlan();

  const calculateUsagePercentage = (used:number, limit:number) => {
    return Math.min((Number(used) / Number(limit)) * 100, 100);
  };

  const getBarColor = (percentage:number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-blue-500";
  };

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
                    <p className="text-sm mb-1">Files: {formatFileSize(BigInt(chatbot?.fileUsage??0))} / {formatFileSize(BigInt(userPlan.features.maxStoragePerBot))}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getBarColor(calculateUsagePercentage(chatbot?.fileUsage??0, userPlan.features.maxStoragePerBot))}`}
                        style={{ width: `${calculateUsagePercentage(chatbot?.fileUsage??0, userPlan.features.maxStoragePerBot)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Web Pages: {chatbot?.webUsage??0} / {userPlan.features.maxDocsPerBot}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getBarColor(calculateUsagePercentage(chatbot?.webUsage??0, userPlan.features.maxDocsPerBot))}`}
                        style={{ width: `${calculateUsagePercentage(chatbot?.webUsage??0, userPlan.features.maxDocsPerBot)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-1">YouTube: {chatbot?.videosUsage??0} / {userPlan.features.maxDocsPerBot}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getBarColor(calculateUsagePercentage(chatbot?.videosUsage??0, userPlan.features.maxDocsPerBot))}`}
                        style={{ width: `${calculateUsagePercentage(chatbot?.videosUsage??0, userPlan.features.maxDocsPerBot)}%` }}
                      ></div>
                    </div>
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
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={Rebuild}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Confirm Rebuild
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
          View your Query Logs here
        </span>
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
              Rebuild
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-5">
          <span className="text-lg font-semibold">Rebuilding...</span>
          <Loader2 className="loader mt-2 h-8 w-8 animate-spin"/>
        </div>
      )}
    </div>
  );
};

export default DataStore;