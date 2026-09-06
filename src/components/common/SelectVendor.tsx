"use client";

import { useEffect, useState } from "react";

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

import { getVendorUser } from "@/functions/get-user";

export default function SelectVendor() {
  const [vendorList, setVendorList] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendorUser();

        setVendorList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to fetch vendor users", error);
        setVendorList([]);
      }
    };

    fetchVendors();
  }, []);

  return (
    <Field className="w-fit">
      <Label>Vendor / MVNO</Label>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Vendor / MVNO" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {vendorList.map((vendor) => (
              <SelectItem key={vendor.id} value={String(vendor.LoginID)}>
                {vendor.LoginID}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
