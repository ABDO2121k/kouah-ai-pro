import Navbar from "@/components/Nav";
import { ThemeProvider } from "@/context/theme-provider";
import { ChatProvider } from "@/context/use-chatbot-context";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getServerSession();
  if (!user?.user.email) redirect("/");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main className="dark:bg-black max-h-screen h-screen overflow-y-auto ">
        <ChatProvider>
          <Navbar user={user.user} isDashboard={true} />
          {children}
        </ChatProvider>
      </main>
    </ThemeProvider>
  );
};

export default layout;
