import type { PropsWithChildren } from "react";

import { Footer } from "@/presentation/footer";
import { Header } from "@/presentation/header";
import type { LayoutProps } from "@/typings";

export default async function ({
  children,
  params,
}: PropsWithChildren<LayoutProps>) {
  const { lang } = await params;

  return (
    <>
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}
