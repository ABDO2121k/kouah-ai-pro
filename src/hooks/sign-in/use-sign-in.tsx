"use client";

import { UserLoginProps, UserLoginSchema } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";
import { signIn } from "next-auth/react";

export const useSignInForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: "onChange",
  });
  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      setLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });
      if (result ) {
        if(result.error){
        toast({
          title: "Error",
          description: result?.error,
        });
      }else{
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
      }
      setLoading(false);
    }
  );
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      signIn("google", { callbackUrl: "/dashboard" });
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
