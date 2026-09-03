import { redirect } from "next/navigation";

import { dummySession } from "@/lib/auth/dummySession";
import { SidebarItems } from "../_components/constant";
import { UserRole } from "@/lib/auth/authUtils";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await dummySession();
  const { slug } = await params;

  const item = SidebarItems.find((item) => item.href === `/vnoc/${slug}`);

  if (!item) {
    redirect("/dashboard");
  }

  const hasAccess = item.roles.includes(session?.user?.role as UserRole);

  if (!hasAccess) {
    redirect("/vnoc");
  }

  const Page = item.component;

  return <Page />;
}
