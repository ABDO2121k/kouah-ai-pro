import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormGenerator from "@/components/form-generator";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ThemeType } from "@/actions/customize";
import { cn } from "@/lib/utils";
import { ChatbotType } from "@/hooks/chatbot/use-chatbot";
import { UseLeads } from "@/hooks/leads/use-leads";

export function LeadsForm({
  chatbotId,
  leadFields,
  theme,
  chatbot,
  isPreview = false,
  leadsTitle,
}: {
  chatbotId: string;
  leadFields: {
    id: string;
    fieldName: string;
    required: boolean;
    chatBotId: string | null;
  }[];
  theme: ThemeType;
  chatbot: ChatbotType;
  isPreview?: boolean;
  leadsTitle: string;
}) {
  const {
    loading: leadsLoading,
    errors,
    register: leadsRegister,
    fields,
    handleAddLeadsData,
    showLead,
    setShowLead,
  } = UseLeads(
    chatbotId,
    (leadFields ?? []).map((field) => ({
      fieldName: field.fieldName,
      required: field.required,
    }))
  );

  if (!showLead || fields.length === 0) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPreview) {
      handleAddLeadsData(e);
    }
  };

  const handleClose = () => {
    if (!isPreview) {
      setShowLead(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full mt-2">
      <Card
        className={cn("w-[65%] lg:w-[50%] md:w-[67%] sm:w-[65%]   relative", {
          "bg-black": chatbot?.theme == "dark",
        })}
        style={
          chatbot?.theme === "customize"
            ? {
                background: theme?.containerBackground,
                borderColor: theme?.primaryBackground,
              }
            : {}
        }
      >
        <div
          className="absolute top-2 right-2 cursor-pointer bg-gray-200 rounded-full p-1"
          onClick={handleClose}
        >
          <X size={16} />
        </div>
        <CardHeader>
          <CardTitle>{leadsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <FormGenerator
                key={field.fieldName}
                type="text"
                inputType="input"
                label={field.fieldName}
                placeholder={`Please enter ${field.fieldName}`}
                register={leadsRegister}
                name={field.fieldName}
                errors={errors}
                required={field.required}
                labelStyle={
                  chatbot?.theme === "customize"
                    ? { color: theme?.suggestedQuestionTextColor }
                    : {}
                }
              />
            ))}
            <CardFooter className="flex flex-col items-start mt-4">
              <Button
                type="submit"
                disabled={leadsLoading || isPreview}
                className="mb-2"
                style={
                  chatbot?.theme === "customize"
                    ? {
                        color: theme?.primaryTextColor,
                        background: theme?.primaryBackground,
                      }
                    : {}
                }
              >
                {leadsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <small
                className={cn("text-left text-gray-500",{
                  "text-white":chatbot?.theme === "dark"
                })}
                style={
                  chatbot?.theme === "customize"
                    ? {
                        color: theme?.primaryTextColor,
                      }
                    : {}
                }
              >
                By completing this lead generation form, you grant us permission
                to identify the questions from you in order to provide more
                tailored support.
              </small>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
