import {
  CircleHelp,
  Package,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const sidebarItems: {
  title: string;
  url: string;
  icon: LucideIcon;
  pcCode: string;
  subItems?: {
    title: string;
    url: string;
    subPcCode: string;
  }[];
}[][] = [
  [
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      pcCode: "10",
      subItems: [
        {
          title: "Manage Inventory",
          url: "/dashboard/inventory/manage-inventory",
          subPcCode: "101",
        },
        {
          title: "Add Inventory",
          url: "/dashboard/inventory/add-inventory",
          subPcCode: "102",
        },
        {
          title: "Upload Inventory",
          url: "/dashboard/inventory/upload-inventory",
          subPcCode: "103",
        },
      ],
    },

    {
      title: "Need Help",
      url: "/dashboard/need-help",
      icon: CircleHelp,
      pcCode: "30",
    },

    {
      title: "Virtual NOC",
      url: "/vnoc",
      icon: Server,
      pcCode: "50",
    },

    {
      title: "Checks",
      url: "#",
      icon: ShieldCheck,
      pcCode: "40",
      subItems: [
        {
          title: "Query Sim",
          url: "/dashboard/checks/query-sim",
          subPcCode: "401",
        },
        {
          title: "Coverage",
          url: "/dashboard/checks/coverage",
          subPcCode: "402",
        },
        {
          title: "Validate Device",
          url: "/dashboard/checks/validate-device",
          subPcCode: "403",
        },
        {
          title: "Get Vendor",
          url: "/dashboard/checks/get-vendor",
          subPcCode: "404",
        },
        {
          title: "Query Portin",
          url: "/dashboard/checks/query-portin",
          subPcCode: "405",
        },
      ],
    },
  ],
];
