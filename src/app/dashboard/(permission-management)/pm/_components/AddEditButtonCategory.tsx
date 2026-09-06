"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatPermissionManagement } from "@/hooks/permission-management/use-cat-permission-management";
import type { Category, CategoryInput } from "@/types/pm-types";
import React, { useEffect, useState } from "react";

type AddEditProps = {
  mode: "add" | "edit";
  category?: Category;
};

const userTypes = [
  { value: "SA", label: "Super Admin" },
  { value: "A", label: "Admin" },
  { value: "V", label: "Vendor" },
] as const;

const categoryStatus = [
  { value: "Y", label: "Active" },
  { value: "N", label: "Inactive" },
] as const;

const initialFormData: CategoryInput = {
  utype: [],
  cat_name: "",
  cat_status: "Y",
};

export default function AddEditButtonCategory({
  mode,
  category,
}: AddEditProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryInput>(initialFormData);

  const { addMutation, updateMutation } = useCatPermissionManagement();

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        utype: category.utype
          ? category.utype.split(",").filter(Boolean)
          : ([] as any),
        cat_name: category.cat_name,
        cat_status: category.cat_status,
      });
    } else if (mode === "add") {
      setFormData(initialFormData);
    }
  }, [mode, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: CategoryInput = {
      utype: formData.utype,
      cat_name: formData.cat_name.trim(),
      cat_status: formData.cat_status,
    };

    try {
      if (mode === "add") {
        await addMutation.mutateAsync(input);
      } else {
        if (!category?.id) {
          return;
        }

        await updateMutation.mutateAsync({
          id: category.id,
          input,
        });
      }

      setOpen(false);
      setFormData(initialFormData);
    } catch {
      // onError in the mutation already shows the toast
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      return;
    }

    if (mode === "edit" && category) {
      setFormData({
        utype: category.utype
          ? (category.utype.split(",").filter(Boolean) as any)
          : ([] as any),
        cat_name: category.cat_name,
        cat_status: category.cat_status,
      });
    } else {
      setFormData(initialFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant={mode === "add" ? "default" : "outline"}>
            {mode === "add" ? "Add Category" : "Edit Category"}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <FieldSet>
          {/* User Type */}
          <FieldGroup>
            <Field>
              <Label>User Type</Label>

              <div className="flex items-center gap-3">
                {userTypes.map((item) => (
                  <div key={item.value} className="flex items-center gap-1">
                    <Checkbox
                      id={`user-type-${item.value}`}
                      checked={formData.utype.includes(item.value)}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          utype: checked
                            ? [...prev.utype, item.value]
                            : prev.utype.filter(
                                (value) => value !== item.value,
                              ),
                        }));
                      }}
                    />

                    <Label
                      htmlFor={`user-type-${item.value}`}
                      className="font-normal"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </Field>
          </FieldGroup>

          {/* Category Name */}
          <FieldGroup>
            <Field>
              <Label htmlFor="categoryName">Category Name</Label>

              <Input
                id="categoryName"
                type="text"
                name="categoryName"
                value={formData.cat_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cat_name: e.target.value,
                  }))
                }
              />
            </Field>
          </FieldGroup>

          {/* Category Status */}
          <FieldGroup>
            <Field>
              <Label htmlFor="categoryStatus">Category Status</Label>

              <Select
                value={formData.cat_status}
                onValueChange={(value) => {
                  if (value === "Y" || value === "N") {
                    setFormData((prev) => ({
                      ...prev,
                      cat_status: value,
                    }));
                  }
                }}
              >
                <SelectTrigger id="categoryStatus" className="w-45">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {categoryStatus.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {addMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : mode === "add"
                ? "Add Category"
                : "Update Category"}
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={() => setOpen(false)}
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
