type LogoProps = {
  className?: string;
  /** Use light text for dark backgrounds */
  light?: boolean;
};

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#0f766e" />
      {/* Two interlocking loops - carer and resident */}
      <circle
        cx="16"
        cy="20"
        r="7"
        fill="none"
        stroke="#fbf8f3"
        strokeWidth="3"
      />
      <circle
        cx="24"
        cy="20"
        r="7"
        fill="none"
        stroke="#f6c453"
        strokeWidth="3"
      />
      <circle cx="20" cy="20" r="1.8" fill="#f28c6b" />
    </svg>
  );
}

export default function Logo({ className = "", light = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span
        className={`text-lg font-bold tracking-[0.08em] ${
          light ? "text-white" : "text-ink dark:text-white"
        }`}
      >
        CARERLOOP
      </span>
    </span>
  );
}
