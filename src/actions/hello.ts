"use server";
export async function hello(content: string) {
  const baseUrl = process.env.VERCEL
    ? "https://githubstats.suzuki3.jp"
    : "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/hello?content=${encodeURIComponent(content)}`,
    {
      method: "GET",
    },
  );
  return response.json();
}
