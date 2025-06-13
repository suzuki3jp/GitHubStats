import type { Metadata } from "next";

import "@/presentation/styles/globals.css";
import { Header } from "@/presentation/header";
import { Providers } from "@/presentation/providers";

export const metadata: Metadata = {
  title: "GitHub Stats - Visualize Your GitHub Journey",
  description:
    "Transform your GitHub data into beautiful, insightful visualizations. Track your coding progress, analyze language usage, and showcase your development journey.",
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Header />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
