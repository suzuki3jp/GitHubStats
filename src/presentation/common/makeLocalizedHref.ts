export function makeLocalizedHref(href: string, lang: string): string {
  return `/${lang}${href.startsWith("/") ? href : `/${href}`}`;
}
