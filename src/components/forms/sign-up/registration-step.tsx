"use client";
import { useAuthContext } from "@/context/use-auth-context";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import TypeSelection from "./type-selection-form";
import dynamic from "next/dynamic";
import OtpForm from "./otp-form";
import { Spinner } from "@/components/spinner";




const DetailForm = dynamic(() => import("./account-details-form"), {
  ssr: false,
  loading: () => <Spinner />,
});

const RegistrationFormStep = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { currentStep } = useAuthContext();
  const [onOTP, setOnOTP] = useState("");
  const [onUserType, setOnUserType] = useState<"owner" | "student">("owner");
  setValue("otp", onOTP);
  switch (currentStep) {
    case 1:
      return (
        <TypeSelection
          register={register}
          userType={onUserType}
          setUserType={setOnUserType}
        />
      );
    case 2:
      return <DetailForm register={register} errors={errors} />;
    case 3: return <OtpForm onOTP={onOTP} setOTP={setOnOTP} />
  }
  return <div>registration.-step</div>;
};

export default RegistrationFormStep;
