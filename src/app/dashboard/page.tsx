"use client";

import { CsvDownload } from "@/components/common/CSVDownlaod";
import { useApiMaster } from "@/hooks/vendor-settings/useApiMaster";

export default function DashboardPage() {
  const { apis, isLoading, isError, error } = useApiMaster();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <CsvDownload data={apis as any} filename="api-master.csv" />
    </div>
  );
}
