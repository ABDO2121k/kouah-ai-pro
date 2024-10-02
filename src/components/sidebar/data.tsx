import {
  AlertCircle,
  // Archive,
  ArchiveX,
  File,
  // Inbox,
  LucideProps,
  MessageCircle,
  MessagesSquare,
  Paintbrush,
  Send,
  Settings,
  // ShoppingCart,
  // Trash2,
  Users2,
  UserPlus,
  BarChart2,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const links1: {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  variant: "default" | "ghost";
  navigation?: string;
}[] = [
  {
    title: "Chat",
    icon: MessageCircle,
    variant: "ghost",
    navigation: "/dashboard/bot",
  },
  {
    title: "Generale",
    icon: Settings,
    variant: "ghost",
    navigation: "/dashboard/generale",
  },
  {
    title: "Customize",
    icon: Paintbrush,
    variant: "ghost",
    navigation: "/dashboard/customize",
  },
  {
    title: "Leads",
    icon: UserPlus,
    variant: "ghost",
    navigation: "/dashboard/leads",
  },
  {
    title: "Query Log",
    icon: BarChart2,
    variant: "ghost",
    navigation: "/dashboard/query-log",
  },
  // {
  //   title: "Drafts",
  //   label: "9",
  //   icon: File,
  //   variant: "ghost",
  // },
  // {
  //   title: "Sent",
  //   label: "",
  //   icon: Send,
  //   variant: "ghost",
  // },
  // {
  //   title: "Junk",
  //   label: "23",
  //   icon: ArchiveX,
  //   variant: "ghost",
  // },
  // {
  //   title: "Trash",
  //   label: "",
  //   icon: Trash2,
  //   variant: "ghost",
  // },
  // {
  //   title: "Archive",
  //   label: "",
  //   icon: Archive,
  //   variant: "ghost",
  // },
];

// export const links2: {
//   title: string;
//   label?: string;
//   icon: ForwardRefExoticComponent<
//     Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
//   >;
//   variant: "default" | "ghost";
// }[] = [
//   {
//     title: "Social",
//     label: "972",
//     icon: Users2,
//     variant: "ghost",
//   },
//   {
//     title: "Updates",
//     label: "342",
//     icon: AlertCircle,
//     variant: "ghost",
//   },
//   {
//     title: "Forums",
//     label: "128",
//     icon: MessagesSquare,
//     variant: "ghost",
//   },
//   // {
//   //   title: "Shopping",
//   //   label: "8",
//   //   icon: ShoppingCart,
//   //   variant: "ghost",
//   // },
//   // {
//   //   title: "Promotions",
//   //   label: "21",
//   //   icon: Archive,
//   //   variant: "ghost",
//   // },
// ];
