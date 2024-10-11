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
