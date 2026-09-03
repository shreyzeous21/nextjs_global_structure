"use client";

import { useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { downloadCsv, type CsvRow } from "@/lib/download";

type CsvDownloadProps = {
  data: CsvRow[];
  filename?: string;
  columns?: string[];
  label?: string;
};

export function CsvDownload({
  data,
  filename = "export.csv",
  columns,
  label = "Download",
}: CsvDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!data.length || downloading) return;

    setDownloading(true);

    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");

      const timestamp =
        `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_` +
        `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

      const finalFilename = filename.replace(/\.csv$/i, `_${timestamp}.csv`);

      downloadCsv({
        data,
        filename: finalFilename,
        columns,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleDownload}
      disabled={!data.length || downloading}
      className=""
    >
      <FaFileCsv className="size-4" />
      <span>{downloading ? "..." : label}</span>
    </Button>
  );
}
