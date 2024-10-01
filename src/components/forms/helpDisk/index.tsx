"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import Accordion from "@/components/accordion/Accordion";
import FormGenerator from "@/components/form-generator";
import { useHelpDesk } from "@/hooks/helpDisk/use-helpDisk";

const HelpDesk = () => {
  const {
    register,
    errors,
    onSubmitQuestion,
    isQuestions,
    loading,
    onDeleteQuestions,
  } = useHelpDesk();
  return (
    <Card className="w-full sm:w-[80%]  grid grid-cols-1 lg:grid-cols-2">
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle className="text-lg lg-text-2xl md:text-lg font-bold ">
          Help Desk
        </CardTitle>
        <form onSubmit={onSubmitQuestion} className="flex flex-col gap-6 mt-10">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Question</p>
            <p className="text-sm font-light">
              Add a question that you believe is frequently asked.
            </p>
            <FormGenerator
              inputType="input"
              register={register}
              errors={errors}
              form="help-desk-form"
              name="question"
              placeholder="Type your question"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Answer to question</p>
            <p className="text-sm font-light">
              The answer for the question above.
            </p>
            <FormGenerator
              inputType="textarea"
              register={register}
              errors={errors}
              name="answer"
              form="help-desk-form"
              placeholder="Type your answer"
              type="text"
              lines={5}
            />
          </div>
          <Button
            type="submit"
            className="bg-[#06b6d4] hover:bg-[#06b6d4] hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold"
          >
            Create
          </Button>
        </form>
      </CardContent>
      <CardContent className="p-6 overflow-y-auto chat-window">
        <Loader loading={loading}>
          {isQuestions.length ? (
            isQuestions.map((question) => (
              <Accordion
                key={question.id}
                trigger={question.question}
                content={question.answer}
                withTooltip={true}
                onDeleteQuestions={onDeleteQuestions}
                id={question.id}
              />
            ))
          ) : (
            <CardDescription>No Questions to show</CardDescription>
          )}
        </Loader>
      </CardContent>
    </Card>
  );
};

export default HelpDesk;
