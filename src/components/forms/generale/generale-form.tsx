"use client";

import FormGenerator from "@/components/form-generator";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { USER_GENERALE_FORM } from "@/constants/forms";
import { useGenerale } from "@/hooks/generale/use-generale";
import React from "react";

const GeneraleForm = () => {
  const { errors, register, loading, setValue, watch, changeGenerale } =
    useGenerale();
  const isHelpDisk = watch("isHelpDisk");
  const isLead = watch("isLead");
  const isRealTimeChat = watch("isRealTimeChat");

  return (
    <div className="flex flex-col gap-3 p-10 shadow-sm shadow-zinc-500 rounded-lg  w-full sm:w-[80%]">
      <form className="h-full" onSubmit={changeGenerale}>
        <div className="flex flex-col justify-between gap-3 h-full">
          <Loader loading={loading}>
            <div className="flex flex-col justify-between gap-3 h-full ">
              {/* <FormGenerator
                errors={errors}
                register={register}
                name={"name"}
                type="text"
                placeholder="Enter Chatbot Name"
                label="Name : "
                inputType="input"
              /> */}
              {USER_GENERALE_FORM.map((filed) => (
                <FormGenerator
                  key={filed.id}
                  errors={errors}
                  register={register}
                  {...filed}
                  name={filed.name}
                />
              ))}
              <div className="grid grid-cols-3 gap-2">
                <Label className="flex flex-col gap-2  mb-2 mt-2 col-span-3 lg:col-span-1 md:col-span-2">
                  Show Leads ?
                  <Switch
                    checked={isLead}
                    onCheckedChange={(checked: boolean) =>
                      setValue("isLead", checked)
                    }
                    className="data-[state=checked]:bg-[#06b6d4] data-[state=unchecked]:bg-zinc-400"
                  />
                </Label>
                <Label className="flex flex-col gap-2  mb-2 mt-2 col-span-3 lg:col-span-1 md:col-span-2">
                  Use real time Chat ?
                  <Switch
                    checked={isRealTimeChat}
                    onCheckedChange={(checked: boolean) =>
                      setValue("isRealTimeChat", checked)
                    }
                    className="data-[state=checked]:bg-[#06b6d4] data-[state=unchecked]:bg-zinc-400"
                  />
                </Label>
                <Label className="flex flex-col gap-2  mb-2 mt-2 col-span-3 lg:col-span-1 md:col-span-2">
                  Show HelpDesk ?
                  <Switch
                    checked={isHelpDisk}
                    onCheckedChange={(checked: boolean) =>
                      setValue("isHelpDisk", checked)
                    }
                    className="data-[state=checked]:bg-[#06b6d4] data-[state=unchecked]:bg-zinc-400"
                  />
                </Label>
              </div>

              <div className="flex items-end justify-end w-full">
                <Button variant={"outline"}>Save</Button>
              </div>
            </div>
          </Loader>
        </div>
      </form>
    </div>
  );
};

export default GeneraleForm;
