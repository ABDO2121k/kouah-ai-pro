"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useBillings } from "@/hooks/billings/use-billings";

const SubscriptionButton = ({ type }: { type: string }) => {
  const { handleBillingAction, isLoading, error } = useBillings();

  const handleClick = async () => {
    await handleBillingAction(type);
  };

  return (
    <>
      <Button className="w-full" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Upgrade now"}{" "}
        <ArrowRight className="h-5 w-5 ml-1.5" />
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default SubscriptionButton;
