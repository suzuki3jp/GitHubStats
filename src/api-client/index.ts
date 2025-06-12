import type { paths } from "@/openapi/openapi";
import createClient, { ClientMethod, type Client } from "openapi-fetch";

export class ApiClient {
  private client: Client<paths>;

  constructor() {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    this.client = createClient<paths>({
      baseUrl: API_BASE_URL,
    });
  }

  getHello() {
    if (this.shouldReturnDummy()) {
      return Promise.resolve({ data: { message: "Hello, Dummy!" } });
    }

    return this.client.GET("/api/hello", {
      params: {
        query: {
          content: "To Next.js",
        },
      },
    });
  }

  private shouldReturnDummy(): boolean {
    const isVercel = process.env.VERCEL === "1";
    const isProduction = process.env.NODE_ENV === "production";

    return isVercel && isProduction;
  }
}
