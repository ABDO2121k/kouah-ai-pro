import { z } from "zod";

export type GeneraleTypes = {
  description: string | undefined;
  isHelpDisk: boolean;
  title: string;
  isRealTimeChat: boolean;
  isLead:boolean
};

export const generaleSchema = z.object({
  description: z.string().nullable(),
  title: z.string().min(1, { message: "You must choose kouahBot's name " }),
  isHelpDisk: z.boolean().optional().default(true),
  isRealTimeChat: z.boolean().optional().default(false),
  isLead : z.boolean().optional().default(false)
});
