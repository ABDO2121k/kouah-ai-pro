"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";
import {
  HelpDeskQuestionsProps,
  HelpDeskQuestionsSchema,
} from "@/schemas/helpDisk-schema";
import {
  createChatbotHelpDisk,
  deleteChatbotHelpDisk,
  onGetAllHelpDeskQuestions,
} from "@/actions/helpDisk";
import { useChatContext } from "@/context/use-chatbot-context";

export const useHelpDesk = () => {
  const { selectedChatbot } = useChatContext();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<HelpDeskQuestionsProps>({
    resolver: zodResolver(HelpDeskQuestionsSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string; answer: string }[]
  >([]);
  const onSubmitQuestion = handleSubmit(async (values) => {
    setLoading(true);
    const question = await createChatbotHelpDisk(selectedChatbot, values);
    if (question) {
      setIsQuestions(question.questions!);
      toast({
        title: question.code == 200 ? "Success" : "Error",
        description: question.message,
      });
      setLoading(false);
      reset();
    }
  });

  const onGetQuestions = async () => {
    setLoading(true);
    const questions = await onGetAllHelpDeskQuestions(selectedChatbot);
    if (questions) {
      setIsQuestions(questions.questions);
      setLoading(false);
    }
  };

  const onDeleteQuestions = async (questionId:string) => {
    setLoading(true);
    const questions = await deleteChatbotHelpDisk(selectedChatbot,questionId);
    if (questions) {
      setIsQuestions(questions.questions);
      setLoading(false);
    }
  };
  useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    register,
    onSubmitQuestion,
    errors,
    isQuestions,
    loading,
    onDeleteQuestions
  };
};
