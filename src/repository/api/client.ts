import createFetcher from "openapi-fetch";

import type { paths } from "./openapi";

export function createApiClient() {
  const baseUrl = process.env.LOCAL
    ? "http://localhost:3000"
    : "https://githubstats.suzuki3.jp";
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

  async getStatus() {
    return await this.fetcher.GET("/status");
  }
}
