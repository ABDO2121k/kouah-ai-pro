"use client";
import { addLeadsData } from "@/actions/leads";
import { createSchema } from "@/schemas/leads.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";

export const UseLeads = (
  chatbotId: string,
  fields: {
    fieldName: string;
    required: boolean;
  }[]
) => {
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(createSchema(fields)),
    mode: "onChange",
  });
  const handleAddLeadsData = handleSubmit(async (values) => {
    setLoading(true);
    const leadsData = Object.entries(values).map(([fieldName, value]) => ({
      fieldName,
      value: value as string,
    }));
    const response = await addLeadsData(chatbotId, leadsData);
    setLoading(false);
    setShowLead(false);
    toast({
      title: response.code == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.code == 200 ? "default" : "destructive",
    });
  });
  return {
    reset,
    watch,
    loading,
    errors,
    register,
    fields,
    handleAddLeadsData,
    showLead,
    setShowLead,
  };
};
