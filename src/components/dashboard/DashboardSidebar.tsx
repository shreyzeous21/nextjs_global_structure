import React from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardSidebar() {
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

      <SidebarContent className="px-2 py-4"></SidebarContent>
    </Sidebar>
  );
}
