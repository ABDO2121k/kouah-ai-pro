"use client"
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

const ColorSelector = ({ title }: { title: string }) => {
  const [color, setColor] = useState("#000000");
  const inputRef = useRef(null);
  // eslint-disable-next-line
  const handleColorChange = (e:any) => {
    setColor(e.target.value);
  };
  return (
    <div className="space-y-2">
      <Label
        htmlFor={`${title.replace(/\s+/g, "-").toLowerCase()}-form-item`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {title}
      </Label>
      <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border">
        <Palette className="h-6 w-6" />
        <input
          ref={inputRef}
          type="color"
          id={`${title.replace(/\s+/g, "-").toLowerCase()}-form-item`}
          value={color}
          onChange={handleColorChange}
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
