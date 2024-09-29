import { ThemeType } from "@/actions/customize";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export function SuggestedQ({
  suggestQ,
  theme,
  chatbotTheme,
  onSuggestedQuestionClick,
  usedSuggestedQuestions,
}: {
  suggestQ: string[];
  chatbotTheme: ThemeType;
  theme: string | undefined;
  onSuggestedQuestionClick: (question: string) => void;
  usedSuggestedQuestions: string[];
}) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {suggestQ.map(
            (suggestion) =>
              suggestion &&
              !usedSuggestedQuestions.includes(suggestion) && (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer flex items-center rounded-full border text-xs font-medium border-gray-400/30 text-foreground px-3 bg-zinc-300 text-start max-w-full truncate break-words"
                        style={
                          theme === "customize"
                            ? {
                                color: chatbotTheme?.suggestedQuestionTextColor,
                                background:
                                  chatbotTheme?.suggestedQuestionBackground,
                              }
                            : {}
                        }
                        onClick={() => onSuggestedQuestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black dark:bg-zinc-800 dark:text-white border">
                      <p>Click to ask</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
