import { getEnv } from "@playlistwizard/env";
import { GitCommit, Heart } from "lucide-react";

import { useServerT } from "@/presentation/hooks/t/server";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

export async function Footer({ lang }: FooterProps) {
  const { t } = await useServerT(lang, "footer");

  const isLocal = process.env.VERCEL_ENV === "development";
  const commitInfo = getEnv([
    "VERCEL_GIT_REPO_OWNER",
    "VERCEL_GIT_REPO_SLUG",
    "VERCEL_GIT_COMMIT_SHA",
  ]);

  if (!isLocal && commitInfo.isErr())
    throw new Error("Failed to get commit info on Vercel");

  // On Vercel, the commit info is available in the system environment variables
  // See: https://vercel.com/docs/environment-variables/system-environment-variables
  // On local, we will use a placeholder URL
  const commitShortHash = commitInfo
    .map(([_, __, sha]) => sha.slice(0, 7))
    .unwrapOr("Local");
  const commitUrl = commitInfo
    .map(
      ([repositoryOwner, repositoryName, sha]) =>
        `https://github.com/${repositoryOwner}/${repositoryName}/commit/${sha}`,
    )
    .unwrapOr("https://example.com");

  return (
    <footer className="border-slate-800 border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-4 text-slate-400 text-sm">
            <span>
              © {new Date().getFullYear()} suzuki3jp. All rights reserved.
            </span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-current text-red-500" />
              <span>in Japan</span>
            </div>
          </div>

          <div className="flex gap-1 text-slate-400 text-sm">
            <Trans
              t={t}
              i18nKey={"deployed"}
              components={{
                1: (
                  <Link
                    href={commitUrl}
                    className="flex items-center text-[#2D80FF] hover:underline"
                  >
                    <GitCommit className="h-3 w-3" />
                    <span>{commitShortHash}</span>
                  </Link>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterProps {
  lang: string;
}
