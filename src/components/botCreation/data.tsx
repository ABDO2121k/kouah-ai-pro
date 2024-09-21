import Youtube from "@/icons/Youtube";
import { Globe, FileUp } from "lucide-react";

type TABS_MENU_PROPS = {
  label: string;
  icon?: JSX.Element;
};

export const TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: "File",
    icon: <FileUp />,
  },
  {
    label: "Web",
    icon: <Globe />,
  },
  {
    label: "Youtube",
    icon: <Youtube className="h-8 w-8" />,
  },
];
