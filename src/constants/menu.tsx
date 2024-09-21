import HelpDeskIcon from '@/icons/help-desk-icon'
import ChatIcon from '@/icons/chat-icon'






type TABS_MENU_PROPS = {
  label: string;
  icon?: JSX.Element;
};

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: "chat",
    icon: <ChatIcon />,
  },
  {
    label: "helpdesk",
    icon: <HelpDeskIcon />,
  },
];
