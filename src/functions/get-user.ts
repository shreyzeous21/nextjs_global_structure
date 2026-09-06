"use server";

import { sqlQueryArray } from "@/config/database/query/raw";
import { auth } from "@/lib/auth/auth";

export const getVendorUser = async () => {
  const session = await auth();

  try {
    let result;

    if (session?.user.role === "superadmin")
      result = await sqlQueryArray(
        `
        SELECT id, LoginID
        FROM login_details
        ORDER BY LoginID ASC
      `,
      );

    if (session?.user?.role === "company") {
      result = await sqlQueryArray(
        `
        SELECT id, LoginID
        FROM login_details
        WHERE id = ${session.user.id}
        ORDER BY LoginID ASC
      `,
      );
    }
    console.log("Vendor users fetched:", result);
    return result;
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    return [];
  }
};

export const getCompanyUser = async () => {
  return null;
};
