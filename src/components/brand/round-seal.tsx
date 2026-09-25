import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function MyPetsRoundSeal({
  className,
  watermark = false,
}: {
  className?: string;
  watermark?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block shrink-0 rounded-full bg-white/95 bg-contain bg-center bg-no-repeat shadow-lg ring-1 ring-black/10",
        watermark ? "opacity-15 shadow-none ring-0" : "opacity-[.86]",
        className,
      )}
      style={{ backgroundImage: `url("${BRAND.logoUrl}")` }}
    />
  );
}
