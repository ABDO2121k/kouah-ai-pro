import ColorSelectors from "@/components/dashboard/Customize/color";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCustomizeThemeContext } from "@/context/use-theme-context";
import React from "react";

const ColorForm = () => {
  const { handleCustomizeTheme } = useCustomizeThemeContext();
  return (
    <Card className="w-full px-5">
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle className="text-lg lg-text-2xl md:text-lg font-bold ">
          Textual Customize
        </CardTitle>
        <form
          className="flex flex-col gap-6 mt-10"
          onSubmit={handleCustomizeTheme}
        >
          <Loader loading={false}>
            <ColorSelectors />
            <Button className="bg-[#06b6d4] hover:bg-[#06b6d4] hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold">
              Customize
            </Button>
          </Loader>
        </form>
      </CardContent>
    </Card>
  );
};

export default ColorForm;
