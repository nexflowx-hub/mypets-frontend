import { cn } from "@/lib/utils";

/** Coral heart + white paw — MyPets brand mark (replaceable logo component) */
export function MyPetsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 44C10 34 2 25.5 2 15.5 2 8.6 7.4 3 14.2 3 18 3 21.6 4.9 24 8 26.4 4.9 30 3 33.8 3 40.6 3 46 8.6 46 15.5 46 25.5 38 34 24 44Z"
        fill="#FF6258"
      />
      {/* paw */}
      <g fill="#fff">
        <ellipse cx="17.2" cy="16.2" rx="2.7" ry="3.4" transform="rotate(-18 17.2 16.2)" />
        <ellipse cx="23.9" cy="14.2" rx="2.8" ry="3.6" />
        <ellipse cx="30.7" cy="16.2" rx="2.7" ry="3.4" transform="rotate(18 30.7 16.2)" />
        <path d="M24 22.2c3.8 0 7 3 7 6.4 0 2.6-2.1 4.2-4.6 3.6-1.6-.4-3.2-.4-4.8 0-2.5.6-4.6-1-4.6-3.6 0-3.4 3.2-6.4 7-6.4Z" />
      </g>
    </svg>
  );
}

export function MyPetsLogo({
  className,
  compact = false,
  light = false,
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <MyPetsMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[19px] font-extrabold tracking-tight",
            light ? "text-white" : "text-petrol"
          )}
        >
          MyPets
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
              light ? "text-white/60" : "text-muted-foreground"
            )}
          >
            Pessoas. Animais. Impacto Real.
          </span>
        )}
      </span>
    </span>
  );
}

/** White paw — FacePets brand mark */
export function FacePetsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <ellipse cx="14.5" cy="17.5" rx="4.2" ry="5.4" transform="rotate(-16 14.5 17.5)" />
        <ellipse cx="24" cy="14" rx="4.4" ry="5.8" />
        <ellipse cx="33.5" cy="17.5" rx="4.2" ry="5.4" transform="rotate(16 33.5 17.5)" />
        <ellipse cx="8.5" cy="27" rx="3.6" ry="4.4" transform="rotate(-30 8.5 27)" />
        <ellipse cx="39.5" cy="27" rx="3.6" ry="4.4" transform="rotate(30 39.5 27)" />
        <path d="M24 24.5c6 0 11 4.8 11 10 0 3.9-3.2 6.5-7 5.7-2.6-.6-5.4-.6-8 0-3.8.8-7-1.8-7-5.7 0-5.2 5-10 11-10Z" />
      </g>
    </svg>
  );
}

export function FacePetsLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-white", className)}>
      <FacePetsMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[19px] font-extrabold tracking-tight">FacePets</span>
        <span className="mt-1 text-[10px] font-medium text-white/60">Every pet has a story.</span>
      </span>
    </span>
  );
}
