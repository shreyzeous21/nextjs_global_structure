"use server";

import { sqlQuery } from "@/config/database";
import { sqlQueryArray } from "@/config/database/query/raw";

export type Permission = {
  id: number;
  cat_id: number;
  cat_name: string;
  p_name: string;
  p_desc: string;
  p_status: "Y" | "N";
  forVendor: "Y" | "N";
  forAdmin: "Y" | "N";
  p_allow_msg: string;
};

export async function getPermissionList(): Promise<Permission[]> {
  try {
    return await sqlQueryArray<Permission>(
      "SELECT p.id, p.cat_id, c.cat_name, p.p_name, p.p_desc, p.p_status, p.forVendor, p.forAdmin, p.p_allow_msg FROM tbl_permission p LEFT JOIN tbl_permission_category c ON c.id = p.cat_id ORDER BY p.id DESC",
      { debug: true },
    );
  } catch (error) {
    console.error("Unable to fetch permission list", error);
    throw new Error("Unable to fetch permission list");
  }
}

export async function deletePermission(id: number): Promise<void> {
  try {
    const existing = await sqlQueryArray<Permission>(
      `
        SELECT id, cat_id, p_name, p_desc, p_status, forVendor, forAdmin, p_allow_msg
        FROM tbl_permission
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    if (existing.length === 0) {
      throw new Error("Permission not found!");
    }

    await sqlQuery(
      `
        DELETE FROM tbl_permission
        WHERE id = ?
      `,
      [id],
    );
  } catch (error) {
    console.error("Unable to delete permission", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to delete permission",
    );
  }
}
