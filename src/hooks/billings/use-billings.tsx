"use client";
import { useState } from "react";

export const useBillings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBillingAction = async (packageIndication: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageIndication }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleBillingAction, isLoading, error };
};
