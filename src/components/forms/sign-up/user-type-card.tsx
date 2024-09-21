"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SetStateAction } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import {User} from "lucide-react"
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  title: string;
  text: string;
  register: UseFormRegister<FieldValues>;
  userType: "owner" | "student";
  setUserType: React.Dispatch<SetStateAction<"owner" | "student">>;
};

const UserTypeCard = ({ value, title, text, userType, register,setUserType }: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          "w-full cursor-pointer mt-5 mb-3",
          userType == value && "border-[#06b6d4]"
        )}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                "flex justify-center p-3",
                userType == value && "border-[#06b6d4]"
              )}
            >
              <User
                size={30}
                className={cn(
                  userType == value ? "text-[#06b6d4]" : "text-gray-400"
                )}
              />
            </Card>
            <div className="">
              <CardDescription className="text-iridium">
                {title}
              </CardDescription>
              <CardDescription className="text-gray-400">
                {text}
              </CardDescription>
            </div>
          </div>
          <div>
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                userType == value ? "bg-[#06b6d4]" : "bg-transparent"
              )}
            >
              <Input
                {...register("type", {
                  onChange: (event) => setUserType(event.target.value),
                })}
                value={value}
                id={value}
                className="hidden"
                type="radio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  );
};

export default UserTypeCard;
