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
import { cn } from "@/lib/utils";

type Props = {
  trigger: string;
  content: string;
  withTooltip?: boolean;
  onDeleteQuestions?: (questionId: string) => Promise<void>;
  id?: string;
  theme?: string;
  background?: string;
  textColor?: string;
};

const Accordion = ({
  content,
  trigger,
  withTooltip,
  onDeleteQuestions,
  id,
  textColor,
  background,
  theme,
}: Props) => {
  return (
    <ShadcnAccordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {withTooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn("text-black ", {
                      "text-white": theme == "dark",
                    })}
                  >
                    {trigger}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  // eslint-disable-next-line
                  onClick={() =>
                    onDeleteQuestions != undefined &&
                    onDeleteQuestions(id ?? "")
                  }
                  className={cn("bg-destructive  text-black ", {
                    "text-white": theme == "dark",
                  })}
                >
                  <Trash className="h-5 w-5" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span
              className={cn("text-black ", {
                "text-white": theme == "dark",
              })}
            >
              {trigger}
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent
          className={cn("text-black ", {
            "text-white bg-zinc-800": theme == "dark",
          })}
        >
          {content}
        </AccordionContent>
      </AccordionItem>
    </ShadcnAccordion>
  );
};

export default Accordion;
