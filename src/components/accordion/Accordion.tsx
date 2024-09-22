import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion as ShadcnAccordion,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Trash } from "lucide-react";

type Props = {
  trigger: string;
  content: string;
  withTooltip?: boolean;
  onDeleteQuestions?: (questionId: string) => Promise<void>;
  id?: string;
};

const Accordion = ({
  content,
  trigger,
  withTooltip,
  onDeleteQuestions,
  id,
}: Props) => {
  return (
    <ShadcnAccordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {withTooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{trigger}</span>
                </TooltipTrigger>
                <TooltipContent
                  // eslint-disable-next-line
                  onClick={() =>
                    onDeleteQuestions != undefined &&
                    onDeleteQuestions(id ?? "")
                  }
                  className="bg-destructive  text-black "
                >
                  <Trash className="h-5 w-5" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span>{trigger}</span>
          )}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </ShadcnAccordion>
  );
};

export default Accordion;
