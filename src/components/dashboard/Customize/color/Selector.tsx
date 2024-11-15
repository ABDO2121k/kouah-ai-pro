"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface ColorSelectorProps {
  element: {
    label: string;
    name: string;
  };
  //eslint-disable-next-line
  watch: (name: string) => any;
   //eslint-disable-next-line
  register: UseFormRegister<any>;
}

const ColorSelector = ({ element, watch, register }: ColorSelectorProps) => {
  const color = watch(element.name);
  
  return (
    <div className="space-y-2">
      <Label
        htmlFor={`${element.label.replace(/\s+/g, "-").toLowerCase()}-form-item`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {element.label}
      </Label>
      <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border">
        <Palette className="h-6 w-6" />
        <input
          type="color"
          id={`${element.label.replace(/\s+/g, "-").toLowerCase()}-form-item`}
          value={color ?? "#ffffff"}
          {...register(element.name)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div
          className="absolute -right-1.5 -top-1 h-3.5 w-3.5 rounded-full border border-input"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ColorSelector;
