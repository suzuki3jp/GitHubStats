import createFetcher from "openapi-fetch";

import { getBaseUrl } from "@/usecase/actions/get-base-url";
import type { paths } from "./openapi";

export async function createApiClient() {
  const baseUrl = await getBaseUrl();
  return new ApiClient(`${baseUrl}/api/v1`);
}

export class ApiClient {
  private fetcher;

  constructor(baseUrl: string) {
    this.fetcher = createFetcher<paths>({
      baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getUser(access_token: string) {
    return await this.fetcher.GET("/user", {
      params: {
        query: {
          access_token,
        },
      },
    });
  }

  async getContributionDays(username: string, access_token: string) {
    return await this.fetcher.GET("/contribution-days", {
      params: {
        query: {
          username,
          access_token,
        },
      },
    });
  }

  async getLanguageStats(username: string, access_token: string) {
    return await this.fetcher.GET("/language-stats", {
      params: {
        query: {
          username,
          access_token,
        },
      },
    });
  }

  async getStatus() {
    return await this.fetcher.GET("/status");
  }
}
