"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useBillings } from "@/hooks/billings/use-billings";
import { Plans } from "@prisma/client";

interface SubscriptionButtonProps {
  type: Plans;
  currentPlan: Plans | null;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ type, currentPlan }) => {
  const { handleBillingAction, isLoading, error } = useBillings();

  const isCurrentPlan = type === currentPlan;

  const handleClick = async () => {
    await handleBillingAction(type);
  };

  return (
    <>
      <Button className="w-full" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : isCurrentPlan ? "Manage Subscription" : "Upgrade now"}{" "}
        <ArrowRight className="h-5 w-5 ml-1.5" />
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default SubscriptionButton;
