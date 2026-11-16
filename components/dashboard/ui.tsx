"use client";

/**
 * CarerLoop dashboard design system.
 *
 * Conventions:
 * - Corners: `rounded-md` for surfaces & controls, `rounded-full` only for pills/avatars/dots.
 * - Palette: ink text, teal-brand primary, cream/mint washes, coral for attention.
 * - Every page composes: <PageHeader/> → optional stats grid → <Panel/>s.
 */

import { ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  X,
  XCircle,
  Ban,
  Mail,
  RefreshCw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Class recipes (use when a component would be overkill)              */
/* ------------------------------------------------------------------ */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-brand/20 cursor-pointer whitespace-nowrap";

export const btn = {
  primary: `${btnBase} px-4 py-2.5 bg-teal-brand text-white hover:bg-teal-deep shadow-sm`,
  secondary: `${btnBase} px-4 py-2.5 bg-white text-ink border border-ink/12 hover:border-teal-brand/40 hover:bg-mint/40`,
  ghost: `${btnBase} px-3 py-2 text-ink/70 hover:text-ink hover:bg-ink/5`,
  danger: `${btnBase} px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 shadow-sm`,
  dangerSoft: `${btnBase} px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`,
  sm: "!px-3 !py-1.5 !text-xs",
  icon: "inline-grid place-items-center w-9 h-9 rounded-md text-ink/55 hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer disabled:opacity-40",
};

export const field = {
  label: "block text-xs font-semibold text-ink/75 mb-1.5",
  input:
    "w-full rounded-md border border-ink/12 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-all focus:outline-none focus:border-teal-brand focus:ring-4 focus:ring-teal-brand/10 disabled:bg-ink/[0.03] disabled:text-ink/50",
  hint: "mt-1.5 text-[11px] text-ink/50",
  error: "mt-1.5 text-[11px] font-medium text-red-600",
};

export const table = {
  wrap: "overflow-x-auto -mx-px",
  table: "w-full text-sm text-left border-separate border-spacing-0",
  th: "sticky top-0 z-[1] bg-[#f8faf9] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink/50 border-b border-ink/8 whitespace-nowrap first:pl-5 last:pr-5",
  tr: "group transition-colors hover:bg-mint/30",
  td: "px-4 py-3.5 border-b border-ink/[0.06] text-ink/80 align-middle first:pl-5 last:pr-5 group-last:border-b-0",
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
  /** Optional row rendered under the title (e.g. tabs, context pills) */
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {Icon && (
            <span className="hidden sm:grid place-items-center w-12 h-12 rounded-md bg-gradient-to-br from-teal-brand to-teal-deep text-white shadow-lg shadow-teal-brand/25 shrink-0">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-teal-brand">
                {eyebrow}
              </div>
            )}
            <h1 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-ink leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-ink/60 max-w-2xl leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
      </div>
      {children}
    </header>
  );
}

export function Panel({
  title,
  description,
  action,
  icon: Icon,
  children,
  className = "",
  bodyClassName = "p-5",
  flush = false,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Remove body padding (tables, lists that bleed to the edges) */
  flush?: boolean;
}) {
  return (
    <section
      className={`bg-white border border-ink/[0.08] rounded-md overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-ink/[0.06]">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className="grid place-items-center w-8 h-8 rounded-md bg-mint text-teal-brand shrink-0">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-[15px] font-semibold text-ink truncate">{title}</h2>}
              {description && <p className="text-xs text-ink/55 mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={flush ? "" : bodyClassName}>{children}</div>
    </section>
  );
}

/** Filter/search bar that sits above lists. Stacks on mobile. */
export function Toolbar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center gap-3 p-3 bg-white border border-ink/[0.08] rounded-md ${className}`}
    >
      {children}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`relative flex-1 min-w-0 ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/35 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${field.input} pl-10 bg-ink/[0.02]`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink/40 hover:text-ink hover:bg-ink/5"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );
}

/** Segmented control for small option sets (status filters, tabs). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; count?: number }[];
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex max-w-full overflow-x-auto p-1 rounded-md bg-ink/[0.04] border border-ink/[0.06] ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.value)}
            className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-semibold whitespace-nowrap transition-all ${
              active ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className={`px-1.5 rounded-full text-[10px] tabular-nums ${
                  active ? "bg-teal-brand text-white" : "bg-ink/8 text-ink/55"
                }`}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badges & status                                                     */
/* ------------------------------------------------------------------ */

const badgeTones = {
  teal: "bg-mint text-teal-deep border-teal-brand/15",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  amber: "bg-amber-50 text-amber-700 border-amber-200/70",
  coral: "bg-coral-soft text-[#b4532f] border-coral/25",
  red: "bg-red-50 text-red-700 border-red-200/70",
  violet: "bg-lilac-soft text-[#5144a8] border-lilac/25",
  sky: "bg-sky-soft text-[#2d6ea3] border-sky/25",
  slate: "bg-ink/[0.04] text-ink/65 border-ink/10",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  tone = "slate",
  icon: Icon,
  dot,
  children,
  className = "",
}: {
  tone?: BadgeTone;
  icon?: LucideIcon;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${badgeTones[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

const statusMap: Record<string, { tone: BadgeTone; icon: LucideIcon; label?: string }> = {
  ACTIVE: { tone: "green", icon: CheckCircle2 },
  APPROVED: { tone: "green", icon: CheckCircle2 },
  ADMITTED: { tone: "green", icon: CheckCircle2 },
  ACCEPTED: { tone: "green", icon: CheckCircle2 },
  VERIFIED: { tone: "green", icon: CheckCircle2 },
  COMPLETED: { tone: "green", icon: CheckCircle2 },
  PENDING: { tone: "amber", icon: Clock },
  PENDING_REVIEW: { tone: "amber", icon: Clock },
  PENDING_VERIFICATION: { tone: "amber", icon: Mail },
  SUBMITTED: { tone: "sky", icon: Clock },
  IN_REVIEW: { tone: "sky", icon: Clock },
  INVITED: { tone: "sky", icon: Mail },
  SENT: { tone: "sky", icon: Mail },
  INACTIVE: { tone: "slate", icon: Ban },
  SUSPENDED: { tone: "coral", icon: AlertTriangle },
  EXPIRED: { tone: "slate", icon: Clock },
  REVOKED: { tone: "red", icon: XCircle },
  REJECTED: { tone: "red", icon: XCircle },
  DISABLED: { tone: "red", icon: Ban },
  ARCHIVED: { tone: "slate", icon: Ban },
};

/** Maps an API status string to a coloured badge with icon + readable label. */
export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  const key = (status ?? "UNKNOWN").toUpperCase().replace(/[\s-]/g, "_");
  const s = statusMap[key] ?? { tone: "slate" as BadgeTone, icon: Clock };
  const label = s.label ?? key.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return (
    <Badge tone={s.tone} icon={s.icon} className={className}>
      {label}
    </Badge>
  );
}

const avatarHues = [
  "from-teal-400 to-teal-700",
  "from-amber-300 to-orange-500",
  "from-violet-400 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-rose-300 to-coral",
  "from-emerald-300 to-emerald-600",
];

export function Avatar({
  name,
  size = "md",
  className = "",
}: {
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const n = (name ?? "").trim() || "?";
  const initials = n
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = avatarHues[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarHues.length];
  const dims = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" }[size];
  return (
    <span
      className={`inline-grid place-items-center shrink-0 rounded-full bg-gradient-to-br ${hue} text-white font-bold shadow-sm ring-2 ring-white ${dims} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-14 ${className}`}>
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-mint blur-xl opacity-80" />
        <span className="relative grid place-items-center w-14 h-14 rounded-md bg-white border border-teal-brand/15 text-teal-brand shadow-sm animate-float-slow">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink/55 leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retrying,
}: {
  title?: string;
  message?: ReactNode;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-md border border-red-200 bg-gradient-to-r from-red-50 to-white">
      <span className="grid place-items-center w-10 h-10 rounded-md bg-red-100 text-red-600 shrink-0">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-800">{title}</p>
        {message && <p className="mt-0.5 text-xs text-red-700/80 break-words">{message}</p>}
      </div>
      {onRetry && (
        <button onClick={onRetry} disabled={retrying} className={`${btn.dangerSoft} ${btn.sm}`}>
          <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-ink/[0.06]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ opacity: 1 - i * 0.12 }}>
          <Skeleton className="w-9 h-9 !rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 !rounded-full hidden sm:block" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-md bg-white border border-ink/[0.08] space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

/** Labelled key/value used in detail cards & drawers. */
export function DataItem({
  label,
  children,
  icon: Icon,
}: {
  label: ReactNode;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink/45">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink truncate">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: centred dialog on desktop, bottom sheet on mobile            */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  size = "md",
  tone = "default",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "default" | "danger";
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const width = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" }[size];

  return createPortal(
    <div
      className="cl-modal fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="cl-modal-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`cl-modal-panel relative w-full ${width} max-h-[92vh] flex flex-col bg-white rounded-t-xl sm:rounded-md shadow-[0_30px_80px_-20px_rgba(19,48,45,0.45)] overflow-hidden`}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink/15" />
        <div className="flex items-start gap-3 px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-ink/[0.06]">
          {Icon && (
            <span
              className={`grid place-items-center w-10 h-10 rounded-md shrink-0 ${
                tone === "danger" ? "bg-red-50 text-red-600" : "bg-mint text-teal-brand"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className="text-base sm:text-lg font-semibold text-ink leading-snug">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-ink/55">{description}</p>}
          </div>
          <button onClick={onClose} className={btn.icon} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 sm:px-6 py-4 border-t border-ink/[0.06] bg-[#f8faf9]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
