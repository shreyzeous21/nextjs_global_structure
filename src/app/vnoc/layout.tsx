import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";
import VnocSidebar from "./_components/VnocSidebar";
import VnocHeader from "./_components/VnocHeader";
import { dummySession } from "@/lib/auth/dummySession";

export const metadata: Metadata = {
  title: "Vnoc",
  description: "Vnoc - Connect with your MVNOS",
};

export default async function VnocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await dummySession();
  return (
    <SidebarProvider>
      <VnocSidebar session={session} />
      <SidebarInset>
        <VnocHeader />
        <main className="mt-2 lg:pt-20 lg:px-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
    