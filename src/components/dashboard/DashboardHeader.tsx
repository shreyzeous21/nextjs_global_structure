"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/layout/ModeToggle";
import UserProfile from "@/components/layout/UserProfile";
import DashboardHeaderSearchbar from "./DashboardHeaderSearchbar";
import Link from "next/link";
import { Button } from "../ui/button";
import { HeadphonesIcon } from "lucide-react";
import UserSettings from "./user-management/UserSettingsController";
import AutoBreadcrumb from "../common/AutoBreadcrumb";

export default function DashboardHeader() {
  return (
    <header className="lg:fixed sticky lg:w-[calc(100%-var(--sidebar-width))]  top-0 z-10 flex items-center justify-between gap-4 border-b p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 " />
        <div className="h-6 w-px bg-border" />
        <AutoBreadcrumb />
      </div>

      <DashboardHeaderSearchbar />

      <div className="flex items-center gap-1">
        <Link href="/dashboard/need-help" className="hidden lg:block">
          <Button variant="outline" className={"flex items-center gap-2"}>
            <HeadphonesIcon className="size-4" />
            Support
          </Button>
        </Link>
        <UserProfile />
        <UserSettings />
        <ModeToggle />
      </div>
    </header>
  );
}
