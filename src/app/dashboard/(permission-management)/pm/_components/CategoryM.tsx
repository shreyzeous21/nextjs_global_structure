"use client";

import Datatable from "@/components/common/data-table/Datatable";
import { Badge } from "@/components/ui/badge";
import { usePermissionManagement } from "@/hooks/permission-management/use-cat-permission-management";
import type { Category } from "@/actions/permission-management/pm-cat-action";
import { ColumnDef } from "@tanstack/react-table";
import { CsvDownload } from "@/components/common/CSVDownlaod";
import AddEditButton from "./AddEditButton";
import { Button } from "@/components/ui/button";
import { GlobalDeleteButton } from "@/components/common/GlobalDeleteButton";

const userTypeLabels: Record<string, string> = {
  A: "Admin",
  V: "Vendor",
  SA: "Super Admin",
};

export default function CategoryM() {
  const { categoryList, isError, isLoading, deleteMutation } =
    usePermissionManagement();

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
          <AddEditButton mode="edit" />
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

  const csvData =
    categoryList?.map((category, index) => ({
      "sr.NO": index + 1,
      utype: category.utype
        ?.split(",")
        .map((type) => type.trim())
        .map((type) => userTypeLabels[type] ?? "Unknown")
        .join(", "),
      cat_name: category.cat_name,
      cat_status: category.cat_status === "Y" ? "Active" : "Inactive",
    })) ?? [];

  return (
    <Datatable
      data={categoryList || []}
      columns={columns}
      title="Category List"
      enableSearch={false}
      error={isError ? "Unable to fetch category list" : undefined}
      loading={isLoading}
      enableColumnVisibility
      downloadButton={
        <CsvDownload
          data={csvData}
          filename="categories"
          columns={["sr.NO", "utype", "cat_name", "cat_status"]}
        />
      }
      headerAction={<AddEditButton mode="add" />}
    />
  );
}
