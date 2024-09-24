"use client";
import FormGenerator from "@/components/form-generator";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { USER_LOGO_FORM } from "@/constants/forms";
import { useCustomizeContext } from "@/context/use-customize-context";
import React from "react";

const LogoForm = () => {
  const { loading, register, errors, handleCustomizeLogo, control } =
    useCustomizeContext();
  return (
    <Card className="w-full px-5">
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle className="text-lg lg-text-2xl md:text-lg font-bold ">
          Textual Customize
        </CardTitle>
        <form
          onSubmit={handleCustomizeLogo}
          className="flex flex-col gap-6 mt-10"
        >
          <Loader loading={loading}>
            {USER_LOGO_FORM.map((filed) => (
              <FormGenerator
                key={filed.id}
                errors={errors}
                register={register}
                {...filed}
                name={filed.name}
                control={control}
              />
            ))}

            <Button className="bg-[#06b6d4] hover:bg-[#06b6d4] hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold">
              Customize
            </Button>
          </Loader>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogoForm;
