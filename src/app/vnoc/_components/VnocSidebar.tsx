"use client";

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

  const sidebarItems = SidebarItems.filter((item) =>
    item.roles.includes(session.user.role),
  );

  return (
    <Sidebar>
      <SidebarHeader className="flex h-[4.3rem] items-center justify-center border-b">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/BlueConnectsLogo.png"
            alt="BlueConnects"
            width={160}
            height={50}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="gap-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex w-full flex-col items-center justify-center
                    gap-2 rounded-xl px-2 py-4
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#3E87F7] text-white shadow-sm"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      flex size-10 items-center justify-center rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-white/15"
                          : "bg-muted group-hover:bg-background"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        size-5 transition-all duration-200
                        ${
                          isActive
                            ? "text-white stroke-[2.5]"
                            : `${item.iconClassName} stroke-[2]`
                        }
                      `}
                    />
                  </div>

                  {/* Title */}
                  <span
                    className={`
                      text-center text-xs font-medium leading-tight
                      ${
                        isActive
                          ? "text-white"
                          : "text-foreground/80 group-hover:text-foreground"
                      }
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

      <SidebarFooter className="border-t px-3 py-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="truncate text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              BlueConnects
            </Link>

            <Badge
              variant="secondary"
              className="h-5 shrink-0 px-1.5 text-[10px] font-medium"
            >
              v5.0.0
            </Badge>
          </div>

          <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
            © 2006-{currentYear} BlueConnects
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
