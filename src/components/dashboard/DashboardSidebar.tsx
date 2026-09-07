"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { sidebarItems } from "./constants";
import { Badge } from "../ui/badge";
import DashboardSidebarSearch from "./DashboardSidebarSearch";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <Sidebar>
      {/* Header */}
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

      {/* Search */}
      <div className="px-2 py-4">
        <DashboardSidebarSearch />
      </div>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        {sidebarItems.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {group.map((item) => {
              const hasChildren = !!item.subItems && item.subItems.length > 0;

              const hasActiveChild = item.subItems?.some(
                (sub) => pathname === sub.url,
              );

              const isOpen = openGroups[item.title] ?? !!hasActiveChild;

              const Icon = item.icon;

              return (
                <div key={item.pcCode}>
                  {/* Parent */}
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.title)}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-sm font-medium
                        transition-all duration-200
                        ${
                          hasActiveChild || isOpen
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex size-8 shrink-0 items-center justify-center
                          rounded-lg transition-colors
                          ${
                            hasActiveChild || isOpen
                              ? "bg-blue-100 dark:bg-blue-900/50"
                              : "bg-muted group-hover:bg-background"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            size-4.5
                            ${
                              hasActiveChild || isOpen
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-muted-foreground"
                            }
                          `}
                        />
                      </div>

                      <span className="flex-1 text-left">{item.title}</span>

                      <span
                        className={`
                          rounded-md px-1.5 py-0.5 text-[10px] font-semibold
                          ${
                            hasActiveChild || isOpen
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {item.pcCode}
                      </span>

                      <ChevronDown
                        className={`
                          size-4 shrink-0 transition-transform duration-200
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-sm font-medium
                        transition-all duration-200
                        ${
                          pathname === item.url
                            ? "bg-[#3E87F7] text-white shadow-sm"
                            : "text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex size-8 shrink-0 items-center justify-center
                          rounded-lg
                          ${
                            pathname === item.url
                              ? "bg-white/15"
                              : "bg-muted group-hover:bg-background"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            size-4.5
                            ${
                              pathname === item.url
                                ? "text-white"
                                : "text-emerald-500"
                            }
                          `}
                        />
                      </div>

                      <span className="flex-1 text-left">{item.title}</span>

                      <span
                        className={`
                          rounded-md px-1.5 py-0.5 text-[10px] font-semibold
                          ${
                            pathname === item.url
                              ? "bg-white/15 text-white"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {item.pcCode}
                      </span>
                    </Link>
                  )}

                  {/* Children */}
                  {hasChildren && (
                    <div
                      className={`
                        grid transition-all duration-200
                        ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="relative ml-7 mt-1 space-y-1 border-l pl-3">
                          {item.subItems?.map((sub) => {
                            const isActive = pathname === sub.url;

                            return (
                              <Link
                                key={sub.subPcCode}
                                href={sub.url}
                                className={`
                                  group flex items-center gap-2
                                  rounded-lg px-3 py-2
                                  text-sm transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-[#3E87F7] font-medium text-white shadow-sm"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  }
                                `}
                              >
                                <span
                                  className={`
                                    size-1.5 rounded-full
                                    ${
                                      isActive
                                        ? "bg-white"
                                        : "bg-muted-foreground/40 group-hover:bg-blue-500"
                                    }
                                  `}
                                />

                                <span className="flex-1"> {sub.title}</span>

                                <span
                                  className={`
                                    text-[10px] font-medium
                                    ${
                                      isActive
                                        ? "text-white/80"
                                        : "text-muted-foreground/60"
                                    }
                                  `}
                                >
                                  {sub.subPcCode}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
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
