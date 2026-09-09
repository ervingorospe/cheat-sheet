import { NavIcon } from "@/types/tabs/nav-icon.type";
import { Folder, Home, Library, User2 } from "@tamagui/lucide-icons-2";

export const leftIcons: NavIcon[] = [
  {
    id: "home",
    icon: Home,
    path: "/(tabs)",
    activePath: "/",
  },
  {
    id: "library",
    icon: Library,
    path: "/(tabs)/library",
    activePath: "/library",
  },
];

export const rightIcons: NavIcon[] = [
  {
    id: "folder",
    icon: Folder,
    path: "/(tabs)/folder",
    activePath: "/folder",
  },
  {
    id: "profile",
    icon: User2,
    path: "/(main)/profile",
    activePath: "/settings",
  },
];
