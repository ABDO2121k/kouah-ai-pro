import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./conversation-shema";

export type LogoFormType = {
  //eslint-disable-next-line
  logo?: any;
  initialMessage: string;
  subTitle: string;
  suggestQ?: string;
  placeHolder?: string;
  theme: "light" | "dark" | "customize";
};

export const LogoFormSchema = z
  .object({
    initialMessage: z
      .string()
      .min(1, { message: "You must choose kouahBot's initial message " })
      .nullable(),
    subTitle: z.string().nullable(),
    suggestQ: z.string().nullable(),
    theme: z
      .string()
      .min(1, { message: "You must choose kouahBot's theme " })
      .nullable(),
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

export const ThemFormSchema = z.object({
  containerBackground: z.string(),
  borderColor: z.string(),
  primaryTextColor: z.string(),
  primaryBackground: z.string(),
  botMessageTextColor: z.string(),
  botMessageBackground: z.string(),
  suggestedQuestionTextColor: z.string(),
  suggestedQuestionBackground: z.string(),
  textColor: z.string(),
  textBackground: z.string(),
  placeholderTextColor: z.string(),
});

export type ThemeFormType = z.infer<typeof ThemFormSchema>;
