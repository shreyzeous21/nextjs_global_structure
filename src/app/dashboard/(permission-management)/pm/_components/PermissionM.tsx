"use client";

import Datatable from "@/components/common/data-table/Datatable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { GlobalDeleteButton } from "@/components/common/GlobalDeleteButton";
import { usePermissionManagement } from "@/hooks/permission-management/use-permission-management";
import { Permission } from "@/actions/permission-management/pm-action";

export default function PermissionM() {
  const { permissionList, isError, isLoading, deleteMutation } =
    usePermissionManagement();

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "p_name",
      header: "Permission Type",
    },

    {
      accessorKey: "p_desc",
      header: "Permission Name",
      enableSorting: true,
    },

    {
      accessorKey: "cat_name",
      header: "Category Name",
      enableSorting: true,
    },

    {
      accessorKey: "p_status",
      header: "Permission Status",
      enableSorting: true,
      cell: ({ row }) =>
        row.original.p_status === "Y" ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        ),
    },
    {
      accessorKey: "forVendor",
      header: "For Vendor",
      enableSorting: true,
      cell: ({ row }) =>
        row.original.forVendor === "Y" ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        ),
    },
    {
      accessorKey: "forAdmin",
      header: "For Admin",
      enableSorting: true,
      cell: ({ row }) =>
        row.original.forAdmin === "Y" ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        ),
    },

    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <GlobalDeleteButton
            onDelete={() => deleteMutation.mutate(row.original.id)}
            itemName="permission"
            dialogTitle="Delete Permission"
            dialogDescription="Are you sure you want to delete this permission? This action cannot be undone."
          />
        </div>
      ),
    },
  ];

  return (
    <Datatable
      data={permissionList || []}
      columns={columns}
      title="Permission List"
      enableSearch={false}
      error={isError ? "Unable to fetch permission list" : undefined}
      loading={isLoading}
      enableColumnVisibility
    />
  );
}
