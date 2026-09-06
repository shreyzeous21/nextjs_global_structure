"use client";

import Datatable from "@/components/common/data-table/Datatable";
import { Badge } from "@/components/ui/badge";
import { useCatPermissionManagement } from "@/hooks/permission-management/use-cat-permission-management";
import type { Category } from "@/actions/permission-management/pm-cat-action";
import { ColumnDef } from "@tanstack/react-table";
import { GlobalDeleteButton } from "@/components/common/GlobalDeleteButton";
import AddEditButtonCategory from "./AddEditButtonCategory";
import { useState } from "react";

const userTypeLabels: Record<string, string> = {
  A: "Admin",
  V: "Vendor",
  SA: "Super Admin",
};

export default function CategoryM() {
  const { categoryList, isError, isLoading, deleteMutation } =
    useCatPermissionManagement();

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "utype",
      header: "User Type",
      cell: ({ row }) => {
        const types = row.original.utype
          ?.split(",")
          .map((type) => type.trim())
          .filter(Boolean);

        return (
          <div className="flex flex-wrap gap-0.5 w-50">
            {types?.map((type) => (
              <Badge key={type} variant="secondary">
                {userTypeLabels[type] ?? "Unknown"}
              </Badge>
            ))}
          </div>
        );
      },
    },

    {
      accessorKey: "cat_name",
      header: "Category Name",
      enableSorting: true,
    },

    {
      accessorKey: "cat_status",
      header: "Category Status",
      enableSorting: true,
      cell: ({ row }) =>
        row.original.cat_status === "Y" ? (
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
          <AddEditButtonCategory mode="edit" category={row.original} />
          <GlobalDeleteButton
            onDelete={() => deleteMutation.mutate(row.original.id)}
            itemName="category"
            dialogTitle="Delete Category"
            dialogDescription="Are you sure you want to delete this category? This action cannot be undone."
          />
        </div>
      ),
    },
  ];

  return (
    <Datatable
      data={categoryList || []}
      columns={columns}
      title="Category List"
      enableSearch={false}
      error={isError ? "Unable to fetch category list" : undefined}
      loading={isLoading}
      enableColumnVisibility
      headerAction={<AddEditButtonCategory mode="add" />}
    />
  );
}
