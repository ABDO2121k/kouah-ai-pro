import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import WindowPreview from "../dashboard/chatWindow/preview/windwPreview";

export function DrawerBot() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Preview</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Chatbot Preview</DrawerTitle>
            <DrawerDescription>
              You will see the result of your customization.
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[30rem] overflow-y-auto">
            <WindowPreview />
          </div>
          {/* <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">close</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
