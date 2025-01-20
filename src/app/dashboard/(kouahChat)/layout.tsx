
import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers";
import React from "react";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const layout = cookies().get("react-resizable-panels:layout:mail");
  const collapsed = cookies().get("react-resizable-panels:collapsed");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <Sidebar
        childrenProps={children}
        defaultCollapsed={defaultCollapsed}
        defaultLayout={defaultLayout}
      />
    </div>
  );
};

export default Layout;
