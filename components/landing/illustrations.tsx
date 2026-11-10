/**
 * Hand-built decorative SVGs used across the landing page.
 * All are purely decorative (aria-hidden).
 */

type SvgProps = { className?: string };

export function Squiggle({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 220 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 14c18-10 36-10 54 0s36 10 54 0 36-10 54 0 36 10 54 0"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 500 500" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M421 309c-17 72-86 133-166 141S90 418 58 349 36 196 87 133 220 33 300 47s138 83 143 151c3 40-5 75-22 111z"
      />
    </svg>
  );
}

export function DotGrid({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <pattern id="dot-grid" width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#dot-grid)" />
    </svg>
  );
}

export function Sparkle({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 5.4 3.6 8.9 12 12-8.4 3.1-11.4 6.6-12 12-.6-5.4-3.6-8.9-12-12C8.4 8.9 11.4 5.4 12 0z"
      />
    </svg>
  );
}

export function HeartLine({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 64 56" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 52S4 36 4 18C4 9 11 4 18 4c6 0 11 4 14 9 3-5 8-9 14-9 7 0 14 5 14 14 0 18-28 34-28 34z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wave({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0z"
      />
    </svg>
  );
}

export function DashedArrow({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 160 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 30C40 4 100 4 148 22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
      />
      <path d="M140 12l10 11-14 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Feature icons: two-tone, drawn on a 48x48 grid ---------- */

export function IconResidents({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="18" cy="16" r="7" fill="currentColor" opacity=".25" />
      <circle cx="18" cy="16" r="7" stroke="currentColor" strokeWidth="3" />
      <path d="M5 40c1-7 6-11 13-11s12 4 13 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="34" cy="19" r="5" stroke="currentColor" strokeWidth="3" />
      <path d="M33 29c6 0 9 4 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconHome({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M8 22L24 9l16 13v17a2 2 0 01-2 2H10a2 2 0 01-2-2V22z" fill="currentColor" opacity=".25" />
      <path d="M8 22L24 9l16 13v17a2 2 0 01-2 2H10a2 2 0 01-2-2V22z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 34s-6-3.5-6-7.5a3 3 0 016-1 3 3 0 016 1c0 4-6 7.5-6 7.5z" fill="currentColor" />
    </svg>
  );
}

export function IconAdmission({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="9" y="7" width="30" height="36" rx="4" fill="currentColor" opacity=".25" />
      <rect x="9" y="7" width="30" height="36" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M17 7v-1a2 2 0 012-2h10a2 2 0 012 2v1" stroke="currentColor" strokeWidth="3" />
      <path d="M17 26l5 5 9-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTeam({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="38" height="26" rx="4" fill="currentColor" opacity=".25" />
      <rect x="5" y="11" width="38" height="26" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M7 14l17 12 17-12" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShield({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 5l15 6v11c0 10-6.5 17-15 21C15.5 39 9 32 9 22V11l15-6z" fill="currentColor" opacity=".25" />
      <path d="M24 5l15 6v11c0 10-6.5 17-15 21C15.5 39 9 32 9 22V11l15-6z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <rect x="18" y="21" width="12" height="9" rx="2" fill="currentColor" />
      <path d="M20 21v-3a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function IconChart({ className = "h-7 w-7" }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="36" height="36" rx="6" fill="currentColor" opacity=".25" />
      <rect x="6" y="6" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="3" />
      <path d="M15 33V24M24 33V16M33 33v-6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

