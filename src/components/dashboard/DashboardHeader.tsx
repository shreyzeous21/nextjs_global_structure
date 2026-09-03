"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/layout/ModeToggle";
import UserProfile from "@/components/layout/UserProfile";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-sidebar p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 " />

        <div className="h-6 w-px bg-border" />
      </div>

      <div className="flex items-center gap-4">
        <UserProfile />
        <ModeToggle />
      </div>
    </header>
  );
}
