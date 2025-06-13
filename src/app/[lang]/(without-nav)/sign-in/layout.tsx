import type { PropsWithChildren } from "react";

export default async function ({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}
