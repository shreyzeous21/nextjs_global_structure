import React from "react";
import VnocCard from "../VnocCard";
import DataCard from "./DataCard";

import { Bell, CircleCheck, CircleX, Percent } from "lucide-react";

export default function Vnoc5() {
  return (
    <VnocCard>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          icon={<Bell className="size-7" />}
          name="Total Requests"
          dataCount={1}
          bgColor="bg-blue-500"
        />

        <DataCard
          icon={<CircleX className="size-7" />}
          name="Failures"
          dataCount={1}
          bgColor="bg-red-500"
        />

        <DataCard
          icon={<CircleCheck className="size-7" />}
          name="Success"
          dataCount={1}
          bgColor="bg-green-500"
        />

        <DataCard
          icon={<Percent className="size-7" />}
          name="Failure Rate"
          dataCount={1}
          bgColor="bg-orange-500"
        />
      </div>
    </VnocCard>
  );
}
