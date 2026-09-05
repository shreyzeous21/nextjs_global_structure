import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface DataCardProps {
  icon: React.ReactNode;
  name: string;
  dataCount: number;
  bgColor?: string;
}

export default function DataCard({
  icon,
  name,
  dataCount,
  bgColor = "bg-primary",
}: DataCardProps) {
  return (
    <Card className="w-full border shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgColor} text-white`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-muted-foreground">
            {name}
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {dataCount.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
