"use server";

export async function getBaseUrl() {
  return process.env.LOCAL
    ? "http://localhost:3000"
    : "https://githubstats.suzuki3.jp";
}
