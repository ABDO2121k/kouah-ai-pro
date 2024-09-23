import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./conversation-shema";

export type LogoFormType = {
  //eslint-disable-next-line
  logo?: any;
  initialMessage: string;
  suggestQ?: string;
  placeHolder?: string;
};

export const LogoFormSchema = z
  .object({
    initialMessage: z
      .string()
      .min(1, { message: "You must choose kouahBot's initial message " })
      .nullable(),
    suggestQ: z.string().nullable(),
    placeHolder: z
      .string()
      .min(1, { message: "You must choose kouahBot's placeHolder " })
      .nullable(),
    logo: z.any().optional(),
  })
  .refine((schema) => {
    if (schema.logo?.length) {
      if (
        //eslint-disable-next-line
        ACCEPTED_FILE_TYPES.includes(schema.logo?.[0].type!) &&
        schema.logo?.[0].size <= MAX_UPLOAD_SIZE
      ) {
        return true;
      }
    }
    if (!schema.logo?.length) {
      return true;
    }
  });
