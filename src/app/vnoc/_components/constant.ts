import {
  ArrowLeftRight,
  ArrowRightLeft,
  CalendarDays,
  ChartColumn,
  ChartNoAxesColumnIncreasing,
  Clock3,
  Gauge,
  Hash,
  type LucideIcon,
} from "lucide-react";

import Vnoc1 from "./vnoc1/Vnoc1";
import Vnoc2 from "./vnoc2/Vnoc2";
import Vnoc3 from "./vnoc3/Vnoc3";
import Vnoc4 from "./vnoc4/Vnoc4";
import Vnoc5 from "./vnoc5/Vnoc5";
import Vnoc6 from "./vnoc6/Vnoc6";
import Vnoc7 from "./vnoc7/Vnoc7";
import Vnoc8 from "./vnoc8/Vnoc8";

import type { UserRole } from "@/lib/auth/authUtils";

export const SidebarItems: Array<{
  title: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  roles: UserRole[];
  component: React.ComponentType;
}> = [
  {
    title: "MVNO Day Wise API Records",
    href: "/vnoc/vnoc-1",
    icon: CalendarDays,
    iconClassName: "text-blue-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc1,
  },
  {
    title: "Wholesale Request Chart",
    href: "/vnoc/vnoc-2",
    icon: ChartColumn,
    iconClassName: "text-violet-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc2,
  },
  {
    title: "Wholesale Request & Response",
    href: "/vnoc/vnoc-3",
    icon: ArrowLeftRight,
    iconClassName: "text-emerald-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc3,
  },
  {
    title: "Hourly API Records",
    href: "/vnoc/vnoc-4",
    icon: Clock3,
    iconClassName: "text-orange-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc4,
  },
  {
    title: "API Request Count",
    href: "/vnoc/vnoc-5",
    icon: Hash,
    iconClassName: "text-cyan-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc5,
  },
  {
    title: "API 5 Minutes Graph",
    href: "/vnoc/vnoc-6",
    icon: ChartNoAxesColumnIncreasing,
    iconClassName: "text-pink-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc6,
  },
  {
    title: "API Transaction",
    href: "/vnoc/vnoc-7",
    icon: ArrowRightLeft,
    iconClassName: "text-indigo-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc7,
  },
  {
    title: "API Latency",
    href: "/vnoc/vnoc-8",
    icon: Gauge,
    iconClassName: "text-red-500",
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc8,
  },
];
