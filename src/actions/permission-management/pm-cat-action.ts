"use server";

import { sqlQuery } from "@/config/database";
import { sqlQueryArray } from "@/config/database/query/raw";
import {
  Category,
  CategoryInput,
  categoryIdSchema,
  categoryInputSchema,
} from "@/types/pm-types";
import { ZodError } from "zod";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Invalid input";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getCategoryList(): Promise<Category[]> {
  try {
    return await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        ORDER BY id DESC
      `,
    );
  } catch (error) {
    console.error("Unable to fetch category list", error);

    throw new Error(getErrorMessage(error, "Unable to fetch category list"));
  }
}

export async function addCategoryList(input: CategoryInput): Promise<Category> {
  try {
    // Validate input
    const validated = categoryInputSchema.parse(input);

    // Convert UI array to DB string
    const utype = validated.utype.join(",");
    const cat_name = validated.cat_name;
    const cat_status = validated.cat_status;

    // Check duplicate category name
    const existing = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE cat_name = ?
        LIMIT 1
      `,
      [cat_name],
    );

    if (existing.length > 0) {
      throw new Error("Category name already exists!");
    }

    // Insert
    await sqlQuery(
      `
        INSERT INTO tbl_permission_category
          (utype, cat_name, cat_status)
        VALUES (?, ?, ?)
      `,
      [utype, cat_name, cat_status],
    );

    // Get newly created category
    const newCategory = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE cat_name = ?
        ORDER BY id DESC
        LIMIT 1
      `,
      [cat_name],
    );

    if (newCategory.length === 0) {
      throw new Error("Unable to fetch newly created category!");
    }

    return newCategory[0];
  } catch (error) {
    console.error("Unable to add category list", error);

    throw new Error(getErrorMessage(error, "Unable to add category list"));
  }
}

export async function updateCategoryList(
  id: number,
  input: CategoryInput,
): Promise<Category> {
  try {
    // Validate ID
    const validId = categoryIdSchema.parse(id);

    // Validate input
    const validated = categoryInputSchema.parse(input);

    // Convert UI array to DB string
    const utype = validated.utype.join(",");
    const cat_name = validated.cat_name;
    const cat_status = validated.cat_status;

    // Check category exists
    const existingCategory = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [validId],
    );

    if (existingCategory.length === 0) {
      throw new Error("Category not found!");
    }

    // Check duplicate category name
    const duplicateCheck = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE cat_name = ?
          AND id != ?
        LIMIT 1
      `,
      [cat_name, validId],
    );

    if (duplicateCheck.length > 0) {
      throw new Error("Category name already exists!");
    }

    // Update
    await sqlQuery(
      `
        UPDATE tbl_permission_category
        SET
          utype = ?,
          cat_name = ?,
          cat_status = ?
        WHERE id = ?
      `,
      [utype, cat_name, cat_status, validId],
    );

    // Get updated category
    const updatedCategory = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [validId],
    );

    if (updatedCategory.length === 0) {
      throw new Error("Unable to fetch updated category!");
    }

    return updatedCategory[0];
  } catch (error) {
    console.error("Unable to update category", error);

    throw new Error(getErrorMessage(error, "Unable to update category"));
  }
}

export async function deleteCategoryList(id: number): Promise<void> {
  try {
    // Validate ID
    const validId = categoryIdSchema.parse(id);

    // Check category exists
    const existing = await sqlQueryArray<Category>(
      `
        SELECT
          id,
          utype,
          cat_name,
          cat_status
        FROM tbl_permission_category
        WHERE id = ?
        LIMIT 1
      `,
      [validId],
    );

    if (existing.length === 0) {
      throw new Error("Category not found!");
    }

    // Delete
    await sqlQuery(
      `
        DELETE FROM tbl_permission_category
        WHERE id = ?
      `,
      [validId],
    );
  } catch (error) {
    console.error("Unable to delete category list", error);

    throw new Error(getErrorMessage(error, "Unable to delete category list"));
  }
}
