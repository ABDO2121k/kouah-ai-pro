import Navbar from "@/components/Nav";
import { ThemeProvider } from "@/context/theme-provider";
import { ChatProvider } from "@/context/use-chatbot-context";
import { currentUser } from "@clerk/nextjs";
import React from "react";

interface User {
  id: string;
  fullName: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
  picture: string | null;
}

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const userData: User | null = user
    ? {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        picture: user.imageUrl,
      }
    : null;
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="dark:bg-black max-h-screen h-screen">
        <ChatProvider>
          <Navbar user={userData} isDashboard={true} />
          {children}
        </ChatProvider>
      </main>
    </ThemeProvider>
  );
};

export default layout;
