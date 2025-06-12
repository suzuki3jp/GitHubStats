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

  /**
   * Occurs an error (`Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error TypeError: fetch failed`) during build time when fetchin to the Go Vercel Functions API.
   * This is because the Go Vercel Functions API is not available during build time.
   * To avoid this error, we return a dummy response during build time.
   * @returns
   */
  private shouldReturnDummy(): boolean {
    console.log("======== shouldReturnDummy() called ========");
    console.log("NEXT_PHASE:", process.env.NEXT_PHASE);
    return (
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-development-build"
    );
  }
}
