"use client";

import ChartSection from "@/components/dashboard/home/ChartSection";
import SelectVendor from "@/components/common/SelectVendor";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <SelectVendor />
      <ChartSection />
    </div>
  );
}
