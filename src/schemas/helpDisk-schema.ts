import { z } from "zod";

export type HelpDeskQuestionsProps = {
  question: string;
  answer: string;
};

export const HelpDeskQuestionsSchema = z.object({
  question: z.string().min(1, { message: "Question cannot be left empty" }),
  answer: z.string().min(1, { message: "Answer cannot be left empty" }),
});
