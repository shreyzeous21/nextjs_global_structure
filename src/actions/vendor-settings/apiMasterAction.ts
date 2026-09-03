"use server";

import { sqlQuery } from "@/config/database";

export async function getApiMaster() {
  try {
    const data = await sqlQuery("SELECT * FROM api_master");
    return data;
  } catch (error: any) {
    console.log("Unable to fetch API master", error);
    throw new Error("Unable to fetch API master");
  }
}

export async function createApiMaster() {}

export async function updateApiMaster() {}

export async function deleteApiMaster() {}
