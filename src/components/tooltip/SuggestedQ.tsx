import { ThemeType } from "@/actions/customize";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SuggestedQ({
  suggestQ,
  theme,
  chatbotTheme,
}: {
  suggestQ: string[];
  chatbotTheme: ThemeType;
  theme: string | undefined;
}) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {suggestQ.map(
          (suggestion, index) =>
            suggestion && (
              <Tooltip key={index}>
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
                  >
                    {suggestion}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black dark:bg-zinc-800 dark:text-white border">
                  <p>Click to ask</p>
                </TooltipContent>
              </Tooltip>
            )
        )}
      </div>
    </TooltipProvider>
  );
}
