import { Home } from "@/presentation/home";
import { useServerT } from "@/presentation/hooks/t/server";
import type { SSRProps } from "@/typings";

export default async function ({ params }: SSRProps) {
  const { lang } = await params;
  const { t } = await useServerT(lang, "home");

  return <Home t={t} lang={lang} />;
}
