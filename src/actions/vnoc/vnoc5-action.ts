"use server";

import { sqlQuery } from "@/config/database";

export async function getCountForNotification() {
  const [dataCountForCompany, dataCountForVendor] = await Promise.all([
    sqlQuery(`
        SELECT
          COALESCE(SUM(totalCount), 0) AS total,
          COALESCE(SUM(successCount), 0) AS success,
          COALESCE(SUM(failureCount), 0) AS fail,
          COALESCE(SUM(noUrlCount), 0) AS no_url
        FROM tbl_notify_comp
      `),

    sqlQuery(`
        SELECT
          COALESCE(SUM(totalCount), 0) AS total,
          COALESCE(SUM(successCount), 0) AS success,
          COALESCE(SUM(failureCount), 0) AS fail,
          COALESCE(SUM(noUrlCount), 0) AS no_url
        FROM tbl_notify_comp_vendor
      `),
  ]);

  return {
    dataCountForCompany,
    dataCountForVendor,
  };
}
