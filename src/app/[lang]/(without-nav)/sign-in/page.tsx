import { SignIn } from "@/presentation/sign-in";
import type { PageProps } from "@/typings";

export default async function ({ params }: PageProps) {
  const { lang } = await params;

  return <SignIn lang={lang} />;
}
