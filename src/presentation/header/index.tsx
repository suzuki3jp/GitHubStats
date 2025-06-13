import { Logo } from "@/presentation/common/logo";
import { MaxWidthContainer } from "../common/max-width-container";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <MaxWidthContainer>
        <div className="flex h-16 justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <h1 className="font-bold text-xl">GitHub Stats</h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </MaxWidthContainer>
    </header>
  );
}
