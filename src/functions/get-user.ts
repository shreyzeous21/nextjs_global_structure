"use server";

import { sqlQueryArray } from "@/config/database/query/raw";

export const getVendorUser = async () => {
  return await sqlQueryArray(
    `
      SELECT id, LoginID
      FROM login_details
      ORDER BY LoginID ASC
    `,
  );
};

export const getCompanyUser = async () => {
    return null
};
