"use server";

import { sqlQuery } from "@/config/database";
import { UserRole } from "@/lib/auth/authUtils";

export async function getVendorList() {
  const sessionRole = "vendor" as UserRole;
  try {
    let getVendor;
    if (sessionRole === "admin" || sessionRole === "superadmin")
      getVendor = await sqlQuery(
        "SELECT * FROM login_details order by LoginID",
      );

    if (sessionRole === "vendor")
      getVendor = await sqlQuery(
        "SELECT * FROM login_details WHERE Role = 'vendor' order by LoginID",
      );

    return getVendor;
  } catch (error: any) {
    console.error("Error fetching vendor list:", error);
    throw new Error(error.message || "Failed to fetch vendor list");
  }
}
