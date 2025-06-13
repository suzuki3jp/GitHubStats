import type { PropsWithChildren } from "react";

import { cn } from "./cn";

export function MinHeightContainer({
  children,
  className,
  headerHeight = 64, // デフォルト値
}: MinHeightContainerProps) {
  return (
    <div
      className={cn(className)}
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      {children}
    </div>
  );
}

interface MinHeightContainerProps extends PropsWithChildren {
  className?: string;
  headerHeight?: number; // ヘッダーの高さを props で指定
}
