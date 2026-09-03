"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  if (pathname.startsWith("/vnoc")) {
    return null;
  }
  return <div>Header</div>;
}
