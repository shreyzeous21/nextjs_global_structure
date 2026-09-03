"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItems } from "./constant";

export default function VnocSidebar({ session }: { session: any }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const sidebarItems = SidebarItems.filter((item) => {
    return item.roles.includes(session.user.role);
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-[5.4rem] flex items-center justify-center">
        <Link href="/" className=" transition-opacity hover:opacity-80">
          <Image
            src="/BlueConnectsLogo.png"
            alt="BlueConnects"
            width={200}
            height={200}
            className="object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={`
              group
              flex w-full flex-col items-center gap-2
              rounded-xl py-6
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#3E87F7] font-semibold text-white shadow-sm"
                  : "bg-transparent text-foreground hover:bg-muted"
              }
            `}
                >
                  <Icon
                    className={`h-7 w-7 shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-white stroke-[2.5] "
                        : "text-foreground/70 stroke-[1.8] group-hover:text-foreground"
                    }`}
                  />

                  <span
                    className={`
                text-center
                text-sm
                leading-tight
                ${isActive ? "text-white" : "text-foreground"}
              `}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t py-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="truncate">BlueConnects</span>
            </Link>

            <Badge
              variant="secondary"
              className="h-5 shrink-0 px-1.5 font-medium"
            >
              v5.0.0
            </Badge>
          </div>

          <p className="text-xs text-center leading-relaxed ">
            © 2006-{currentYear} BlueConnects. All rights reserved.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
