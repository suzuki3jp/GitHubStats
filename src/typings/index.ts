import type { TFunction } from "i18next";

export interface SSRProps {
  params: Promise<Record<string, string>>;
}
export interface PageProps extends SSRProps {
  searchParams: Promise<Record<string, string>>;
}

export interface LayoutProps extends SSRProps {
  children: React.ReactNode;
}

export interface WithT {
  t: TFunction;
}

export interface WithLang {
  lang: string;
}
