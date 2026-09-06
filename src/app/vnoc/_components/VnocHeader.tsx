"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/layout/ModeToggle";
import UserProfile from "@/components/layout/UserProfile";

export default function VnocHeader() {
  return (
    <header className="lg:fixed sticky lg:w-[calc(100%-var(--sidebar-width))]  top-0 z-10 flex items-center justify-between gap-4 border-b p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 " />

        <div className="h-6 w-px bg-border" />
      </div>

      <span className="text-blue-500 text-xl font-bold">Virtual NOC</span>

      <div className="flex items-center gap-2">
        <UserProfile />
        <ModeToggle />
      </div>
    </header>
  );
}
