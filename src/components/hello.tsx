"use client";
import type { paths } from "@/openapi/openapi";
import createClient from "openapi-fetch";

export async function Hello({ baseUrl }: { baseUrl: string }) {
  const client = createClient<paths>({ baseUrl });
  const res = await client.GET("/api/hello", {
    params: {
      query: {
        content: "To Next.js",
      },
    },
  });

  return <div>{res.data?.message}</div>;
}
