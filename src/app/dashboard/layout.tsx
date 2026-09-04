import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Footer from "@/components/dashboard/DashboardFooter";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="mt-2 px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
