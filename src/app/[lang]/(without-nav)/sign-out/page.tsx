import { SignOut } from "@/presentation/sign-out";
import type { PageProps } from "@/typings";

export default async function ({ params }: PageProps) {
  const { lang } = await params;

  return <SignOut lang={lang} />;
}
