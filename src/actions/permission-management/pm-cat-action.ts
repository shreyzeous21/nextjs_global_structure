"use server";

import { sqlQuery } from "@/config/database";
import { sqlQueryArray } from "@/config/database/query/raw";

export type Category = {
  id: number;
  utype: string;
  cat_name: string;
  cat_status: "Y" | "N";
};

export async function getCategoryList(): Promise<Category[]> {
  try {
    return await sqlQueryArray<Category>(
      "SELECT id, utype, cat_name, cat_status FROM tbl_permission_category ORDER BY id DESC",
    );
  } catch (error) {
    console.error("Unable to fetch category list", error);
    throw new Error("Unable to fetch category list");
  }
}

export type CategoryInput = {
  utype: string;
  cat_name: string;
  cat_status: "Y" | "N";
};

export async function addCategoryList(input: CategoryInput): Promise<Category> {
  try {
    const utype = input.utype.trim();
    const cat_name = input.cat_name.trim();
    const cat_status = input.cat_status;

    if (!utype) {
      throw new Error("User type is required!");
    }

    if (!cat_name) {
      throw new Error("Category name is required!");
    }

    if (!["Y", "N"].includes(cat_status)) {
      throw new Error("Category status is required!");
    }

    const existing = await sqlQueryArray<Category>(
      `
        SELECT id, utype, cat_name, cat_status
        FROM tbl_permission_category
        WHERE cat_name = ?
        LIMIT 1
      `,
      [cat_name],
    );

    if (existing.length > 0) {
      throw new Error("Category name already exists!");
    }

    await sqlQuery(
      `
        INSERT INTO tbl_permission_category
          (utype, cat_name, cat_status)
        VALUES (?, ?, ?)
      `,
      [utype, cat_name, cat_status],
    );

    const newCategory = await sqlQueryArray<Category>(
      "SELECT id, utype, cat_name, cat_status FROM tbl_permission_category WHERE cat_name = ? ORDER BY id DESC LIMIT 1",
      [cat_name],
    );

    return newCategory[0];
  } catch (error) {
    console.error("Unable to add category list", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to add category list",
    );
  }
}

export async function updateCategoryList(
  id: number,
  input: CategoryInput,
): Promise<Category> {
  try {
    const utype = input.utype.trim();
    const cat_name = input.cat_name.trim();
    const cat_status = input.cat_status;

    if (!id || id <= 0) {
      throw new Error("Invalid category ID!");
    }

    if (!utype) {
      throw new Error("User type is required!");
    }

    if (!cat_name) {
      throw new Error("Category name is required!");
    }

    if (!["Y", "N"].includes(cat_status)) {
      throw new Error("Category status must be Y or N!");
    }

    const existingCategory = await sqlQueryArray<Category>(
      `
        SELECT id, utype, cat_name, cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    if (existingCategory.length === 0) {
      throw new Error("Category not found!");
    }

    const duplicateCheck = await sqlQueryArray<Category>(
      `
        SELECT id, utype, cat_name, cat_status
        FROM tbl_permission_category
        WHERE cat_name = ?
        AND id != ?
        LIMIT 1
      `,
      [cat_name, id],
    );

    if (duplicateCheck.length > 0) {
      throw new Error("Category name already exists!");
    }

    await sqlQuery(
      `
        UPDATE tbl_permission_category
        SET utype = ?,
            cat_name = ?,
            cat_status = ?
        WHERE id = ?
      `,
      [utype, cat_name, cat_status, id],
      "primary",
      { debug: true },
    );

    const updatedCategory = await sqlQueryArray<Category>(
      `
        SELECT id, utype, cat_name, cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    return updatedCategory[0];
  } catch (error) {
    console.error("Unable to update category", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to update category",
    );
  }
}

export async function deleteCategoryList(id: number): Promise<void> {
  try {
    const existing = await sqlQueryArray<Category>(
      `
        SELECT id, utype, cat_name, cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    if (existing.length === 0) {
      throw new Error("Category not found!");
    }

    await sqlQuery(
      `
        DELETE FROM tbl_permission_category
        WHERE id = ?
      `,
      [id],
    );
  } catch (error) {
    console.error("Unable to delete category list", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to delete category list",
    );
  }
}
