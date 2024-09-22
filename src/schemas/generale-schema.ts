import { z } from "zod";

export type GeneraleTypes = {
  description: string | null;
  isHelpDisk: boolean;
  title: string;
};

export const generaleSchema = z.object({
  description: z.string().nullable(),
  title: z.string().min(1, { message: "You must choose kouahBot's name " }),
  isHelpDisk: z.boolean().optional().default(true),
});
