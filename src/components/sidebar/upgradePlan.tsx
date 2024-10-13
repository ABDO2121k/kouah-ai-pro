"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import {
  calculateUsagePercentage,
  getBarColor,
  getUserPlan,
} from "@/lib/utils";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import CustomProgress from "../progress";

const UpgradePlanCard = () => {
  const router = useRouter();
  const { chatbot, chatbots } = useGetChatbot();
  const userPlan = getUserPlan(chatbot);
  // console.log({ chatbot });
  const queriesUsed = chatbot?.User?.subscription?.queriesNumber || 0;
  const queriesLimit = userPlan.features.queriesPerMonth || 0;

  const chatbotsUsed = chatbots?.length ?? 0;
  const chatbotsLimit = userPlan.features.KouahAiBot || 0;
  return (
    <div className="p-1 border rounded-lg shadow-md bg-white text-sm">
      <h3 className="text-base font-semibold">Upgrade Plan</h3>
      <div className="mt-1">
        <p>
          Queries: {queriesUsed} / {queriesLimit}
        </p>
        <CustomProgress
          percentage={calculateUsagePercentage(queriesUsed, queriesLimit)}
          backgroundColor="bg-gray-200"
          fillColor={getBarColor(
            calculateUsagePercentage(queriesUsed, queriesLimit)
          )}
        />
      </div>
      <div className="mt-1">
        <p>
          Chatbots: {chatbotsUsed} / {chatbotsLimit}
        </p>
        <CustomProgress
          percentage={calculateUsagePercentage(chatbotsUsed, chatbotsLimit)}
          backgroundColor="bg-gray-200"
          fillColor={getBarColor(
            calculateUsagePercentage(chatbotsUsed, chatbotsLimit)
          )}
        />
      </div>
      <Button className="mt-4 w-full" onClick={() => router.push("/billings")}>
        <ArrowUp className="mr-1" />
        Upgrade Plan
      </Button>
    </div>
  );
};

export default UpgradePlanCard;
