import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./conversation-shema";

export type LogoFormType = {
  //eslint-disable-next-line
  image?: any;

};

export const LogoFormSchema = z
  .object({
    content: z
      .string()
      .min(1)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    image: z.any().optional(),
  })
  .refine((schema) => {
    if (schema.image?.length) {
      if (
        //eslint-disable-next-line
        ACCEPTED_FILE_TYPES.includes(schema.image?.[0].type!) &&
        schema.image?.[0].size <= MAX_UPLOAD_SIZE
      ) {
        return true;
      }
    }
    if (!schema.image?.length) {
      return true;
    }
  });
