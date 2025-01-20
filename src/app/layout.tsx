import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google"; // anbdlo had font
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomSessionProvider from "@/components/auth/SessionProvider";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kouah ai",
  description:
    "an ai tool that helps users to integrate chatbots to there website with pretrained models , with the ability to train the model with there own data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomSessionProvider>
      <html lang="en">
        <body
          className={cn(
            `max-h-screen overflow-y-auto font-sans antialiased `,
            jakarta.className
          )}
        >
          <TooltipProvider delayDuration={0}>
            <Toaster />
            {children}
          </TooltipProvider>
        </body>
      </html>
    </CustomSessionProvider>
  );
}
