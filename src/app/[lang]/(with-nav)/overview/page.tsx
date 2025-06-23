import { Overview } from "@/presentation/overview";
import type { PageProps } from "@/typings";

export default async function ({ params }: PageProps) {
  const { lang } = await params;

  return <Overview lang={lang} />;
}
