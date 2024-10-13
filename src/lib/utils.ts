import { pricingPackages } from "@/data/packages";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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



export const getBarColor = (percentage:number) => {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-blue-500";
};
//eslint-disable-next-line
export const getUserPlan = (chatbot:any) => {
  const planName = chatbot?.User.subscription?.plan || "FREE";
  return pricingPackages.find(pkg => pkg.indication === planName) || pricingPackages[0];
};

export const calculateUsagePercentage = (used:number, limit:number) => {
  return (Number(used) / Number(limit)) * 100;
};