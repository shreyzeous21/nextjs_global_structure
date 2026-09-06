// app/vnoc/[slug]/page.tsx
import { redirect } from "next/navigation";
import { dummySession } from "@/lib/auth/dummySession";
import { SidebarItems } from "../_components/constant";
import { UserRole } from "@/lib/auth/authUtils";

// ✅ This tells Next.js to generate all your sidebar pages statically
export function generateStaticParams() {
  return SidebarItems.filter((item) => item.href.startsWith("/vnoc/")) // Only VNOC items
    .map((item) => ({
      slug: item.href.replace("/vnoc/", ""), // Extract slug
    }));
}

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
