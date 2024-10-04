import React, { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface LiveChatDialogProps {
  onSubmit: (email: string) => void;
  //eslint-disable-next-line
  style?: any;
  //eslint-disable-next-line
  style2?: any;
  loadingLive: boolean;
  //eslint-disable-next-line
  registerEmail: UseFormRegister<any>;
  //eslint-disable-next-line
  handleLiveSubmit: FormEventHandler<HTMLFormElement>;
  text: string;
  isHistory?: boolean;
  onCancel?: () => void;
}

const WouldLiveForm: React.FC<LiveChatDialogProps> = ({
  style,
  style2,
  loadingLive,
  registerEmail,
  handleLiveSubmit,
  text,
  isHistory,
  onCancel
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-md"
        style={style2}
      >
        <form onSubmit={handleLiveSubmit} className="flex flex-col space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            required
            {...registerEmail("email")}
          />
          {isHistory ? (
            <div className="flex space-x-2">
              <Button
                type="submit"
                style={style}
                className="bg-[#06b6d4] flex-1"
                disabled={loadingLive}
              >
                {loadingLive ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>{text}</>
                )}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                className="bg-gray-300 text-gray-700 flex-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              style={style}
              className="bg-[#06b6d4]"
              disabled={loadingLive}
            >
              {loadingLive ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>{text}</>
              )}
            </Button>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default WouldLiveForm;
