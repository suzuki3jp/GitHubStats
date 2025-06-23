"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

/**
 * Logo component for the application.
 */
export function Logo({ size, className }: LogoProps) {
  const DEFAULT_SIZE = 36;
  const { theme } = useTheme();

  const imageProps = {
    alt: "GitHub Stats Logo",
    width: size || DEFAULT_SIZE,
    height: size || DEFAULT_SIZE,
    className: className,
  };

  return theme === "dark" ? (
    <Image src={"/images/icon-white.png"} {...imageProps} />
  ) : (
    <Image src={"/images/icon-black.png"} {...imageProps} />
  );
}

interface LogoProps {
  size?: number;
  className?: string;
}
