import { Demo } from "@/presentation/demo";
import type { PageProps } from "@/typings";

export default async function ({ params }: PageProps) {
  const { lang } = await params;

  return <Demo lang={lang} />;
}
