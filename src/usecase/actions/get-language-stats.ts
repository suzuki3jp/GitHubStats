"use server";
import { createApiClient } from "@/repository/api/client";

export async function getLanguageStats(user: string, access_token: string) {
  const apiClient = await createApiClient();
  const response = await apiClient.getLanguageStats(user, access_token);

  return response.data;
}
