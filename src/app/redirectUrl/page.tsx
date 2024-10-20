"use client";
import { redirect, useSearchParams } from "next/navigation";

export default function SSOCallback() {
  const searchParams = useSearchParams();
  if (searchParams) {
    const origin = searchParams.get("origin");
    const url = searchParams.get("redirect_url");
    // console.log({origin})
    if (origin == "auth") {
      redirect("/auth-callback");
    } else {
      if (url) {
        redirect(url);
      } else {
        redirect("/dashboard");
      }
    }
  }
}
