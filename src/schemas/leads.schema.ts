import { z } from "zod";

export const createSchema = (
  fields: {
    fieldName: string;
    required: boolean;
  }[]
) => {
  //eslint-disable-next-line
  const acc: { [key: string]: z.ZodType<any> } = {};

  fields.forEach((field) => {
    // If required, use `.min(1)` to ensure it's not empty
    acc[field.fieldName] = field.required
      ? z.string().min(1, `${field.fieldName} is required`)
      : z.string().optional();
  });

  return z.object(acc);
};
