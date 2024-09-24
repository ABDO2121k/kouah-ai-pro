"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { USER_LOGIN_FORM } from "@/constants/forms";
import FormGenerator from "@/components/form-generator";


const LoginForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold"> Login </h2>
      <p className="text-iridium md:text-sm">Enter your email and password</p>
      {USER_LOGIN_FORM.map((filed,i) => (
        <FormGenerator
          key={i}
          errors={errors}
          register={register}
          {...filed}
          name={filed.name}
        />
      ))}
    </>
  );
};

export default LoginForm;
