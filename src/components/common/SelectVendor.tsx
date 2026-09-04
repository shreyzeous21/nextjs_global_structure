"use client";

import { useUser } from "@/hooks/use-user";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectVendor() {
  const { vendorList, isError, isLoading } = useUser();
  return (
    <Field className="w-fit">
      <Label className="">Vendor / MVNO</Label>
      <Select items={vendorList as any[]}>
        <SelectTrigger>
          <SelectValue placeholder="Select Vendor / MVNO" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {Array.isArray(vendorList) &&
              vendorList.map((vendor: any) => (
                <SelectItem key={vendor.id} value={vendor.LoginID}>
                  {vendor.LoginID}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
