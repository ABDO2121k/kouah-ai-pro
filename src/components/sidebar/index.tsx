"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

import { AccountSwitcher } from "./account-switcher";
import { Nav } from "./nav";
import { links1 } from "./data";
import { useChatContext } from "@/context/use-chatbot-context";
import { Loader } from "../loader";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  childrenProps: React.ReactNode;
}

const Sidebar = ({
  defaultLayout = [20, 80],
  defaultCollapsed = false,
  childrenProps,
}: MailProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { chatbots, selectedChatbot } = useChatContext();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          sizes
        )}`;
      }}
      className="items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={5}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onResize={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
        )}
      >
        <div
          className={cn(
            "flex h-[52px] items-center justify-center",
            isCollapsed ? "h-[52px]" : "px-2"
          )}
        >
          <AccountSwitcher isCollapsed={isCollapsed} />
        </div>
        <Separator />
        <Nav isCollapsed={isCollapsed} links={links1} />
        {/* <Separator /> */}
        {/* <Nav isCollapsed={isCollapsed} links={links2} /> */}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={80}>
        <Loader loading={!(chatbots && chatbots.length > 0 && selectedChatbot)}>
          <>{childrenProps}</>
        </Loader>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Sidebar;
