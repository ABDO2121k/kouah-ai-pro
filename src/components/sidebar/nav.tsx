"use client";

import { LucideIcon, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { buttonVariants } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UpgradePlanCard from "./upgradePlan";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    icon: LucideIcon;
    navigation?: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <span
                  onClick={() => router.push(`${link.navigation}`)}
                  className={cn(
                    buttonVariants({
                      variant: link.navigation === path ? "default" : "ghost",
                      size: "icon",
                    }),
                    "h-9 w-9",
                    "default" === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white cursor-pointer"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only text-md">{link.title}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span
              key={index}
              onClick={() => router.push(`${link.navigation}`)}
              className={cn(
                buttonVariants({
                  variant: link.navigation === path ? "default" : "ghost",
                  size: isCollapsed ? "icon" : "sm",
                  className: "cursor-pointer",
                }),
                isCollapsed
                  ? "h-9 w-9 dark:bg-muted m-auto dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  : "justify-start dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {!isCollapsed && link.title}
            </span>
          )
        )}
        <Separator />
        {isCollapsed ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center h-9 w-9 rounded-lg shadow-lg mt-5">
                <Rocket className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <UpgradePlanCard />
            </PopoverContent>
          </Popover>
        ) : (
          <UpgradePlanCard />
        )}
      </nav>
    </div>
  );
}
