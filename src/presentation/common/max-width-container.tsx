import type { PropsWithChildren } from "react";
import { cn } from "./cn";

export function MaxWidthContainer({
  children,
  className,
}: MaxWidthContainerProps) {
  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <div className="container px-4 md:px-6 lg:px-8">{children}</div>
    </div>
  );
}

interface MaxWidthContainerProps extends PropsWithChildren {
  className?: string;
}
