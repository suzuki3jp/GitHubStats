import { Logo } from "@/presentation/common/logo";
import type { WithLang } from "@/typings";
import { MaxWidthContainer } from "../common/max-width-container";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header({ lang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <MaxWidthContainer>
        <div className="flex h-16 justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <h1 className="font-bold text-xl">GitHub Stats</h1>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>
      </MaxWidthContainer>
    </header>
  );
}

interface HeaderProps extends WithLang {}
