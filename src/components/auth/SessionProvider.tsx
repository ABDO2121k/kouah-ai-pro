"use client";

import { SessionProvider } from "next-auth/react";

export default function CustomSessionProvider({ children }: { readonly children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
