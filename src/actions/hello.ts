"use server";
import type { paths } from "@/openapi/openapi";
import createClient from "openapi-fetch";

export async function hello(content: string) {
  const baseUrl = process.env.VERCEL
    ? "https://githubstats.suzuki3.jp"
    : "http://localhost:3000";
  const client = createClient<paths>({
    baseUrl,
  });
  const response = await client.GET("/api/hello", {
    params: {
      query: {
        content: "to Next.js!",
        _: Date.now(), // Add a cache-busting parameter
      },
    },
  });
  return response;
}
