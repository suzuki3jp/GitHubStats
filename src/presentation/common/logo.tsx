import Image from "next/image";

/**
 * Logo component for the application.
 */
export function Logo({ size, className }: LogoProps) {
  const DEFAULT_SIZE = 24;

  return (
    <Image
      src={"/icon.png"}
      alt="GitHub Stats Logo"
      width={size || DEFAULT_SIZE}
      height={size || DEFAULT_SIZE}
      className={className}
    />
  );
}

interface LogoProps {
  size?: number;
  className?: string;
}
