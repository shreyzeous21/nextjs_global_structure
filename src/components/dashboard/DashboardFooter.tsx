"use client";

import Link from "next/link";

export default function DashboardFooter() {
  const foundYear = 2006 + " - " + new Date().getFullYear();
  return (
    <footer className="h-10 justify-center lg:text-lg text-sm font-bold border-t flex items-center w-full gap-2">
      Copyright &copy; {foundYear}{" "}
      <Link href="/" className="text-blue-500 ">
        Blueconnects
      </Link>{" "}
      All rights reserved.
    </footer>
  );
}
