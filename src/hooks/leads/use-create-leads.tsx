"use client";
import { useEffect, useState } from "react";
import { useGetChatbot } from "../chatbot/use-chatbot";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadFields } from "@/actions/leads";
import { toast } from "../use-toast";

interface LeadField {
  id: string;
  fieldName: string;
  required: boolean;
  isEditing?: boolean;
}

export const useCreateLeads = () => {
  const [loading, setLoading] = useState(false);
  const { chatbot,setActions } = useGetChatbot();
  const [leadFields, setLeadFields] = useState<LeadField[]>([]);
  const [newField, setNewField] = useState({ fieldName: "", required: false });

  const schema = z.object({
    leadsTitle: z.string().min(1, { message: "Leads title is required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (chatbot?.leadFields) {
      setLeadFields(
        chatbot.leadFields.map((field: LeadField) => ({
          ...field,
          isEditing: false,
          id: field.id || Date.now().toString(), // Ensure each field has an id
        }))
      );
      reset({
        leadsTitle: chatbot?.leadsTitle,
      });
    }
  }, [chatbot]);

  const handleToggleRequired = (id: string) => {
    setLeadFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  const handleDeleteField = (id: string) => {
    setLeadFields((fields) => fields.filter((field) => field.id !== id));
  };

  const handleAddField = () => {
    if (newField.fieldName.trim()) {
      setLeadFields((prevFields) => [
        ...prevFields,
        { ...newField, id: Date.now().toString(), isEditing: false },
      ]);
      setNewField({ fieldName: "", required: false });
    }
  };

  const handleSaveChanges = handleSubmit(async (values) => {
    setLoading(true);
    const response = await createLeadFields(
      chatbot.id,
      values.leadsTitle,
      leadFields
    );
    toast({
      title: response.code === 200 ? "Success" : "Error",
      description: response.message,
      variant: response.code === 200 ? "default" : "destructive",
    });
    setActions(prev=>prev+1)
    setLoading(false);
  });

  const handleToggleEdit = (id: string) => {
    setLeadFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, isEditing: !field.isEditing } : field
      )
    );
  };

  const handleEditFieldName = (id: string, newName: string) => {
    setLeadFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, fieldName: newName } : field
      )
    );
  };

  return {
    loading,
    leadFields,
    newField,
    errors,
    register,
    handleToggleRequired,
    handleDeleteField,
    handleAddField,
    handleSaveChanges,
    handleToggleEdit,
    handleEditFieldName,
    setNewField,
    reset,
    watch,
  };
};
