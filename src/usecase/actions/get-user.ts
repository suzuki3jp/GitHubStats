"use server";
import { createApiClient } from "@/repository/api/client";

export async function getUser(access_token: string) {
  const apiClient = await createApiClient();
  const response = await apiClient.getUser(access_token);

  return response.data;
}
