"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { sidebarItems } from "./constants";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-[4.3rem] flex items-center justify-center">
        <Link href="/" className="transition-opacity hover:opacity-80">
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
        {sidebarItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2">
            {group.map((item) => {
              const isOpen = openGroups[item.title] ?? false;
              const hasChildren = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.pcCode}>
                  <button
                    onClick={() => hasChildren && toggleGroup(item.title)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <span>
                      {item.title} ({item.pcCode})
                    </span>

                    {hasChildren && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {hasChildren && isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((sub) => {
                        const isActive = pathname === sub.url;

                        return (
                          <Link
                            key={sub.subPcCode}
                            href={sub.url}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                              isActive
                                ? "bg-[#3E87F7] font-medium text-white"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {sub.title} ({sub.subPcCode})
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
