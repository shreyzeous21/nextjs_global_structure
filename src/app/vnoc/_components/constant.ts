import {
  ArrowLeftRight,
  ArrowRightLeft,
  Bell,
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
import Vnoc9 from "./vnoc9/Vnoc9";

import type { UserRole } from "@/lib/auth/authUtils";

export const SidebarItems: Array<{
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  component: React.ComponentType;
}> = [
  {
    title: "MVNO Day Wise API Records",
    href: "/vnoc/vnoc-1",
    icon: CalendarDays,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc1,
  },
  {
    title: "Wholesale Request Chart",
    href: "/vnoc/vnoc-2",
    icon: ChartColumn,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc2,
  },
  {
    title: "Wholesale Request & Response",
    href: "/vnoc/vnoc-3",
    icon: ArrowLeftRight,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc3,
  },
  {
    title: "Hourly API Records",
    href: "/vnoc/vnoc-4",
    icon: Clock3,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc4,
  },
  {
    title: "API Request Count",
    href: "/vnoc/vnoc-5",
    icon: Hash,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc5,
  },
  {
    title: "API 5 Minutes Graph",
    href: "/vnoc/vnoc-6",
    icon: ChartNoAxesColumnIncreasing,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc6,
  },
  {
    title: "API Transaction",
    href: "/vnoc/vnoc-7",
    icon: ArrowRightLeft,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc7,
  },
  {
    title: "API Latency",
    href: "/vnoc/vnoc-8",
    icon: Gauge,
    roles: ["superadmin", "admin", "company", "companychild"],
    component: Vnoc8,
  },
  {
    title: "Notification Count Report",
    href: "/vnoc/vnoc-9",
    icon: Bell,
    roles: ["superadmin"],
    component: Vnoc9,
  },
];
