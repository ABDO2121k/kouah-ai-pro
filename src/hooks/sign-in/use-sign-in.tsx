"use client";

import { UserLoginProps, UserLoginSchema } from "@/schemas/auth-schema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: "onChange",
  });
  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded) return;
      try {
        setLoading(true);
        const authenticated = await signIn.create({
          identifier: values.email,
          password: values.password,
        });

        if (authenticated.status === "complete") {
          await setActive({ session: authenticated.createdSessionId });
          toast({
            title: "Success",
            description: "Welcome back!",
          });
          router.push("/dashboard");
        }
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setLoading(false);
        if (error?.errors[0]?.code === "form_password_incorrect")
          toast({
            title: "Error",
            description: "email/password is incorrect try again",
          });
      }
    }
  );
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("Error during Google Sign In:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    methods,
    onHandleSubmit,
    loading,
    handleGoogleSignIn,
  };
};
