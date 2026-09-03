"use client";

import Link from "next/link";

export default function Footer() {
  const foundYear = 2006 + " - " + new Date().getFullYear();
  return (
    <footer className="h-10 font-bold border-t flex items-center justify-center w-full gap-2">
      Copyright &copy; {foundYear}{" "}
      <Link href="/" className="text-blue-500 ">
        Blueconnects
      </Link>{" "}
      All rights reserved.
    </footer>
  );
}
