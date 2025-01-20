"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from "@/schemas/auth-schema";
import { toast } from "../use-toast";
import { registerUser, sendEmail, verifyOTP } from "@/actions/auth";
import { signIn } from "next-auth/react";

export const useSignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: "owner",
    },
    mode: "onChange",
  });

  const onGenerateOTP = async (
    email: string,
    password: string,
    type: string,
    fullName: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      await registerUser(email, fullName, type, otp.toString(), password);
      await sendEmail(email, otp.toString());
      toast({
        title: "Success",
        description: "OTP sent to your email",
      });
      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
      });
    }
  };

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserRegistrationProps) => {
      try {
        setLoading(true);
        const otpVerification = await verifyOTP(values.email, values.otp);

        if (otpVerification?.status == 200) {
          setLoading(false);
          await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/dashboard",
          });
        }

        if (otpVerification?.status == 400) {
          toast({
            title: "Error",
            description: "Something went wrong!",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
    }
  );
  return {
    methods,
    onHandleSubmit,
    onGenerateOTP,
    loading,
  };
};
