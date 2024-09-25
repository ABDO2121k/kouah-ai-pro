import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Props = {
  triggers: {
    label: string;
    icon?: JSX.Element;
  }[];
  children: React.ReactNode;
  className?: string;
  button?: JSX.Element;
  //eslint-disable-next-line
  style?: any;
};

const TabsMenu = ({ triggers, children, className,style }: Props) => {
  return (
    <Tabs defaultValue={triggers[0].label} className="w-full" style={style}>
      <TabsList className={cn(className)}>
        {triggers.map((trigger, key) => (
          <TabsTrigger
            key={key}
            value={trigger.label}
            className="capitalize flex gap-3 px-5 font-semibold  w-full items-center justify-center flex-1 "
          >
            {trigger.icon && trigger.icon}
            {trigger.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabsMenu;
