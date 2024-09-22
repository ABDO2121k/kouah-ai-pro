"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Copy,
  CopyCheck,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/use-chatbot-context";
import { useState } from "react";
import CopyButton from "../copyButton";

const Dashboard = () => {
  const {
    loading,
    chatbots,
    setSelectedChatbot,
    deletechatbot,
    currentlyDeleting,
  } = useChatContext();
  const router = useRouter();

  return (
    <div className=" mx-auto ">
      <div className="flex justify-between pt-10  mb-10 py-4 px-5">
        <h2 className="text-4xl md:5xl lg:6xl font-bold  p-4">
          My ChatBots :{" "}
        </h2>
        <Button
          variant={"outline"}
          className="border border-zinc-900/75 dark:border-white rounded-md my-auto"
          asChild
        >
          <Link href={"/dashboard/botCreation"} className="flex gap-2">
            new bot <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {chatbots && chatbots?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 p-10">
          {chatbots
            .sort(
              // eslint-disable-next-line
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((chatbot) => (
              <li
                key={chatbot.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white dark:bg-black shadow dark:shadow-white transition hover:shadow-lg dark:hover:shadow-md dark:hover:shadow-zinc-700"
              >
                <div className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="text-center w-full">
                      <CopyButton chatbotId={chatbot.id} />
                    </div>
                    <Button
                      // variant="secondary"
                      onClick={() => {
                        setSelectedChatbot(chatbot.id);
                        router.push("/dashboard/bot");
                      }}
                      type="button"
                      className="border border-zinc-900/75 dark:border-white rounded-md my-auto flex gap-2"
                    >
                      Customize <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {dayjs(chatbot.createdAt).format("DD MMMM YYYY")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => deletechatbot(chatbot.id)}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    {currentlyDeleting === chatbot.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : loading ? (
        <ul className="mb-4 mt-4 py-5 grid grid-cols-1  px-5 gap-6  md:grid-cols-2 lg:grid-cols-3 p-2">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-[#06b6d4] opacity-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-[#06b6d4]  opacity-40" />
                <Skeleton className="h-4 w-[200px] bg-[#06b6d4]  opacity-40" />
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
