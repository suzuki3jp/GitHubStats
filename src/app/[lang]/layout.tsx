import { dir } from "i18next";
import type { Metadata } from "next";

import "@/presentation/styles/globals.css";
import { Header } from "@/presentation/header";
import { useServerT } from "@/presentation/hooks/t/server";
import { supportedLangs } from "@/presentation/localization/settings";
import { Providers } from "@/presentation/providers";
import type { LayoutProps, SSRProps } from "@/typings";

export async function generateMetadata({
  params,
}: SSRProps): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await useServerT(lang, "common");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export const generateStaticParams = () => {
  return supportedLangs.map((lang) => ({ lang }));
};

export default async function ({ children, params }: LayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang} dir={dir(lang)}>
      <body className="antialiased">
        <Providers>
          <Header lang={lang} />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
