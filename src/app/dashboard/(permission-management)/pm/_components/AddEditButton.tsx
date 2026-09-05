"use client";

import type { Category } from "@/actions/permission-management/pm-cat-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { usePermissionManagement } from "@/hooks/permission-management/use-cat-permission-management";
import React, { useState } from "react";

type AddEditProps = {
  mode: "add" | "edit";
};

export default function AddEditButton({ mode }: AddEditProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    utype: "",
    cat_name: "",
    cat_status: "Y",
  });

  const { addMutation } = usePermissionManagement();

  const userTypes = [
    { value: "SA", label: "Super Admin" },
    { value: "A", label: "Admin" },
    { value: "V", label: "Vendor" },
  ];

  const categoryStatus = [
    { value: "Y", label: "Active" },
    { value: "N", label: "Inactive" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("utype", formData.utype);
    form.append("cat_name", formData.cat_name);
    form.append("cat_status", formData.cat_status);

    await addMutation.mutateAsync(form);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={mode === "add" ? "default" : "outline"}>
            {mode === "add" ? "Add Category" : "Edit Category"}
          </Button>
        }
      />

      <DialogContent className={"sm:max-w-2xl"}>
        <DialogHeader>
          <DialogTitle className={"text-xl font-bold"}>
            {mode === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <FieldSet className="">
          <FieldGroup>
            <Field>
              <Label htmlFor="userType">User Type</Label>
              <Select
                value={formData.utype}
                onValueChange={(value) =>
                  setFormData({ ...formData, utype: value as any })
                }
              >
                {userTypes.map((userType) => (
                  <SelectItem key={userType.value} value={userType.value}>
                    {userType.label}
                  </SelectItem>
                ))}
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                type="text"
                name="categoryName"
                value={formData.cat_name}
                onChange={(e) =>
                  setFormData({ ...formData, cat_name: e.target.value })
                }
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <Label htmlFor="categoryStatus">Category Status</Label>

              <Select
                value={formData.cat_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, cat_status: value as any })
                }
              >
                <SelectTrigger className="w-[180px]">
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
          <Button type="submit" onClick={handleSubmit}>
            {mode === "add" ? "Add Category" : "Update Category"}
          </Button>
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
