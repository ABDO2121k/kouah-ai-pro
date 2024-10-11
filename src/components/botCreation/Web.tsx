"use client";
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useUploadUrl } from "../../hooks/upload/use-upload";

const WebUrlUploader = ({
  chatbotId,
  type,
  NotAddVector,
}: {
  chatbotId?: string;
  type: "youtube" | "web";
  NotAddVector?: boolean;
}) => {
  const {
    loading,
    urls,
    errors,
    register,
    handleAddToState,
    handleAddToDB,
    removeUrl,
  } = useUploadUrl(type, chatbotId, NotAddVector);

  return (
    <Card className="w-full px-5">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-lg lg:text-2xl md:text-lg font-bold">
            {type.charAt(0).toUpperCase() + type.slice(1)} URL Upload
          </CardTitle>
        </div>

        <div className="w-full lg:w-3/5 xl:w-7/10 mx-auto space-y-4">
          <form onSubmit={handleAddToState} className="flex flex-col gap-2">
            <div className="flex-grow flex flex-col">
              <label htmlFor="url" className="mb-2 font-medium">
                {`${type.charAt(0).toUpperCase() + type.slice(1)} URL`}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="url"
                  placeholder={`Enter the ${type} URL`}
                  {...register("url")}
                  className="flex-grow px-3 py-2 border rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  className="whitespace-nowrap sm:rounded-l-none"
                  variant={"outline"}
                >
                  Add URL
                </Button>
              </div>
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.url.message?.toString() ?? ""}
                </p>
              )}
            </div>
          </form>
        </div>

        {urls.length > 0 && (
          <div className="mt-4 w-full lg:w-3/5 xl:w-7/10 mx-auto">
            <h3 className="font-semibold mb-2">Added URLs:</h3>
            <ul className="space-y-2">
              {urls.map((url, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded overflow-hidden"
                >
                  <span className="truncate max-w-[10rem] ">{url}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUrl(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {urls.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleAddToDB}
              disabled={loading}
              variant={"outline"}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Bot"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebUrlUploader;
