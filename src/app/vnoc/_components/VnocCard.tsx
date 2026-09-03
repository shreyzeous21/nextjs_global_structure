"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarItems } from "./constant";

export default function VnocCard({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) {
  const pathname = usePathname();
  const title = SidebarItems.find((item) =>
    pathname.startsWith(item.href),
  )?.title;
  return (
    <Card className="w-full h-full">
      {note && <span className="text-center text-red-500">{note}</span>}
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
