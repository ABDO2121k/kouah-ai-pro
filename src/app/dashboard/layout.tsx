import { onCompleteUserRegistrationGoogle } from "@/actions/auth";
import Navbar from "@/components/Nav";
import { ThemeProvider } from "@/context/theme-provider";
import { ChatProvider } from "@/context/use-chatbot-context";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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
  if (!user) redirect("/");

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
  const dbUser = await db.user.findFirst({ where: { clerkId: user?.id } });
  if (!dbUser) {
    const response = await onCompleteUserRegistrationGoogle(
      user?.emailAddresses[0]?.emailAddress || "",
      `${user?.firstName} ${user?.lastName}`,
      user?.id || "",
      "owner"
    );
    if (response.status == 400) {
      redirect("/");
    }
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main className="dark:bg-black max-h-screen h-screen overflow-y-auto ">
        <ChatProvider>
          <Navbar user={userData} isDashboard={true} />
          {children}
        </ChatProvider>
      </main>
    </ThemeProvider>
  );
};

export default layout;
