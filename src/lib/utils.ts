import { pricingPackages } from "@/data/packages";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Stripe from "stripe";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format file size
export function formatFileSize(size: bigint | null): string {
  if (!size) return "N/A";
  const sizeInBytes = Number(size);
  if (sizeInBytes < 1024) return sizeInBytes + " B";
  const sizeInKB = sizeInBytes / 1024;
  if (sizeInKB < 1024) return sizeInKB.toFixed(2) + " KB";
  const sizeInMB = sizeInKB / 1024;
  return sizeInMB.toFixed(2) + " MB";
}

export const getBarColor = (percentage: number) => {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-blue-500";
};
//eslint-disable-next-line
export const getUserPlan = (user: any) => {
  const planName = user.subscription?.plan || "FREE";
  return (
    pricingPackages.find((pkg) => pkg.indication === planName) ||
    pricingPackages[0]
  );
};

export const calculateUsagePercentage = (used: number, limit: number) => {
  return (Number(used) / Number(limit)) * 100;
};

//eslint-disable-next-line
export function formatFeature(key: string, value: any): string {
  switch (key) {
    case "KouahAiBot":
      return `${value} KouahAiBot${value > 1 ? "s" : ""}`;
    case "queriesPerMonth":
      return `${value} queries per month`;
    case "maxWebPages":
      return `Maximum of ${value} docs/webpages`;
    case "maxYoutube":
      return `Maximum of ${value} youtube videos`;
    case "maxStoragePerBot":
      return `${formatFileSize(value)} doc storage per KouahAiBot`;
    case "restAPI":
      return value ? "REST API" : "No REST API";
    case "removePoweredByLabel":
      return value
        ? 'Remove "powered by kouah.ai" label'
        : '"Powered by kouah.ai" label';
    case "queryLogRetention":
      return `${value} days query log retention`;
    default:
      return `${key}: ${value}`;
  }
}

export function getFeatureTooltip(key: string): string {
  switch (key) {
    case "KouahAiBot":
      return "Number of KouahAiBots you can create with this plan.";
    case "queriesPerMonth":
      return "Maximum number of queries you can make per month.";
    case "maxDocsPerBot":
      return "Maximum number of documents or webpages you can add to each KouahAiBot.";
    case "maxStoragePerBot":
      return "Maximum storage capacity for documents per KouahAiBot.";
    case "restAPI":
      return "Access to our REST API for integration with your applications.";
    case "removePoweredByLabel":
      return "Option to remove the 'powered by kouah.ai' label from your chatbots.";
    case "queryLogRetention":
      return "Number of days query logs are retained for your reference.";
    default:
      return "Feature description not available.";
  }
}
