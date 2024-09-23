import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  type: "text" | "email" | "password" | "file";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  form?: string;
  defaultValue?: string;
};

const FormGenerator = ({
  errors,
  inputType,
  name,
  placeholder,
  defaultValue,
  register,
  type,
  form,
  label,
  lines,
  options,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            form={form}
            defaultValue={defaultValue}
            {...register(name)}

          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-1">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "select":
      return (
        <Label htmlFor={`select-${label}`} className=" mb-2 mt-2 p-5">
          {label && label}
          <select form={form} id={`select-${label}`} {...register(name)}             className="outline-none"
          >
            {options?.length &&
              options.map((option) => (
                <option value={option.value} key={option.id}>
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-1">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "textarea":
      return (
        <Label
          className="flex flex-col gap-2 "
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Textarea
            form={form}
            id={`input-${label}`}
            placeholder={placeholder}
            {...register(name)}
            rows={lines}
            defaultValue={defaultValue}
            className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch p-2"
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-1">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    default:
      return <></>;
  }
};

export default FormGenerator;
