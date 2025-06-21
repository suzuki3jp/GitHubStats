"use server";
import { createApiClient } from "@/repository/api/client";

export async function getContributionDays(
  username: string,
  access_token: string,
) {
  const apiClient = createApiClient();
  const response = await apiClient.getContributionDays(username, access_token);

  return response.data;
}
