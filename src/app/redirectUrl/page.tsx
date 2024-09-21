"use client";
import { redirect, useSearchParams } from "next/navigation";

export default function SSOCallback() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  console.log({origin})
  if (origin=="auth") {
    redirect("/auth-callback");
  } else {
    redirect("/dashboard"); // إعادة التوجيه الافتراضية إذا لم يكن هناك redirectUrl
  }
}
