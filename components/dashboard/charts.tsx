"use client";

/**
 * Lightweight SVG chart kit for the dashboard.
 * Palette validated with the dataviz validator (light surface, all checks pass):
 *   series 1 teal #0d9488 · series 2 amber #d97706 · series 3 violet #6d5bd0
 * Specs: 2px lines, ~10% area wash, hairline solid grid, 4px rounded bar ends,
 * 2px surface gaps between segments, >=8px markers with a 2px surface ring,
 * hover tooltips on every chart, text always in ink tokens (never series colour).
 */

import { useEffect, useMemo, useRef, useState } from "react";

export const SERIES = ["#0d9488", "#d97706", "#6d5bd0"] as const;

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * p;
}

const fmt = (n: number) => n.toLocaleString("en-GB");

/* ------------------------------------------------------------------ */
/* Area trend: single series, crosshair + tooltip                      */
/* ------------------------------------------------------------------ */

export function AreaTrend({
  data,
  height = 220,
  valueSuffix = "",
  min,
  max,
  label,
}: {
  data: { label: string; value: number }[];
  height?: number;
  valueSuffix?: string;
  /** Fixed y-domain floor (e.g. 80 for an occupancy % chart) */
  min?: number;
  max?: number;
  /** Accessible description of the series */
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 16, right: 16, bottom: 28, left: 36 };
  const w = Math.max(0, width - pad.left - pad.right);
  const h = height - pad.top - pad.bottom;

  const { yMin, yMax, ticks } = useMemo(() => {
    const vals = data.map((d) => d.value);
    const lo = min ?? Math.floor(Math.min(...vals));
    const hi = max ?? niceMax(Math.max(...vals));
    const step = (hi - lo) / 4;
    return { yMin: lo, yMax: hi, ticks: [0, 1, 2, 3, 4].map((i) => lo + step * i) };
  }, [data, min, max]);

  const x = (i: number) => (data.length <= 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v: number) => h - ((v - yMin) / (yMax - yMin || 1)) * h;

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${h} L0,${h} Z`;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = Math.round((px / (r.width || 1)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const last = data.length - 1;
  const hv = hover ?? null;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(w / 56))));

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={label} className="overflow-visible">
          <defs>
            <linearGradient id="cl-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={SERIES[0]} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SERIES[0]} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g transform={`translate(${pad.left},${pad.top})`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke="rgba(19,48,45,0.08)" strokeWidth={1} />
                <text x={-10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink/45 text-[10px] tabular-nums">
                  {fmt(Math.round(t))}
                </text>
              </g>
            ))}
            {data.map((d, i) =>
              i % labelEvery === 0 || i === last ? (
                <text key={d.label} x={x(i)} y={h + 18} textAnchor="middle" className="fill-ink/45 text-[10px]">
                  {d.label}
                </text>
              ) : null,
            )}

            <path d={area} fill="url(#cl-area)" className="animate-[fade-in_0.8s_ease-out_both]" />
            <path
              d={line}
              fill="none"
              stroke={SERIES[0]}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[draw_1.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            />

            {/* End marker + direct label on the latest value */}
            <circle cx={x(last)} cy={y(data[last].value)} r={4.5} fill={SERIES[0]} stroke="#fff" strokeWidth={2} />
            {hv === null && (
              <text
                x={x(last) - 8}
                y={y(data[last].value) - 10}
                textAnchor="end"
                className="fill-ink text-[11px] font-semibold tabular-nums"
              >
                {fmt(data[last].value)}
                {valueSuffix}
              </text>
            )}

            {hv !== null && (
              <g pointerEvents="none">
                <line x1={x(hv)} x2={x(hv)} y1={0} y2={h} stroke="rgba(19,48,45,0.25)" strokeWidth={1} />
                <circle cx={x(hv)} cy={y(data[hv].value)} r={5} fill={SERIES[0]} stroke="#fff" strokeWidth={2} />
              </g>
            )}

            <rect
              width={w}
              height={h}
              fill="transparent"
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
              className="cursor-crosshair"
            />
          </g>
        </svg>
      )}

      {hv !== null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink text-white px-2.5 py-1.5 text-xs shadow-lg whitespace-nowrap"
          style={{
            left: Math.min(Math.max(pad.left + x(hv), 60), width - 60),
            top: pad.top + y(data[hv].value) - 12,
          }}
        >
          <span className="text-white/60">{data[hv].label}</span>{" "}
          <span className="font-semibold tabular-nums">
            {fmt(data[hv].value)}
            {valueSuffix}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bar list: horizontal single-series bars with value at the tip       */
/* ------------------------------------------------------------------ */

export function BarList({
  data,
  max,
  valueSuffix = "",
  formatValue,
}: {
  data: { label: string; value: number; sublabel?: string; tooltip?: string }[];
  max?: number;
  valueSuffix?: string;
  formatValue?: (v: number) => string;
}) {
  const top = max ?? Math.max(...data.map((d) => d.value), 1);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="space-y-3.5">
      {data.map((d, i) => {
        const pct = Math.max(2, (d.value / top) * 100);
        return (
          <li
            key={d.label}
            className="relative"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-sm font-medium text-ink truncate">{d.label}</span>
              <span className="text-xs text-ink/55 tabular-nums shrink-0">
                {d.sublabel && <span className="mr-2 hidden sm:inline">{d.sublabel}</span>}
                <span className="font-semibold text-ink">
                  {formatValue ? formatValue(d.value) : `${fmt(d.value)}${valueSuffix}`}
                </span>
              </span>
            </div>
            <div className="h-2.5 rounded-[4px] bg-ink/[0.05] overflow-hidden">
              <div
                className="h-full rounded-r-[4px] animate-grow-x transition-opacity"
                style={{
                  width: `${pct}%`,
                  background: SERIES[0],
                  opacity: hover === null || hover === i ? 1 : 0.45,
                  animationDelay: `${i * 90}ms`,
                }}
              />
            </div>
            {hover === i && d.tooltip && (
              <div className="pointer-events-none absolute right-0 -top-9 z-10 rounded-md bg-ink text-white px-2.5 py-1.5 text-xs shadow-lg whitespace-nowrap animate-scale-in">
                {d.tooltip}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented bar: part-to-whole for <=3 categories, legend always on   */
/* ------------------------------------------------------------------ */

export function SegmentedBar({
  segments,
  height = 14,
}: {
  segments: { label: string; value: number }[];
  height?: number;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <div className="relative flex w-full gap-[2px]" style={{ height }}>
        {segments.map((s, i) => (
          <div
            key={s.label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className="relative h-full first:rounded-l-[4px] last:rounded-r-[4px] animate-grow-x transition-opacity cursor-default"
            style={{
              width: `${(s.value / total) * 100}%`,
              background: SERIES[i % SERIES.length],
              opacity: hover === null || hover === i ? 1 : 0.4,
              animationDelay: `${i * 120}ms`,
            }}
          >
            {hover === i && (
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 z-10 rounded-md bg-ink text-white px-2.5 py-1.5 text-xs shadow-lg whitespace-nowrap animate-scale-in">
                {s.label}: <span className="font-semibold">{fmt(s.value)}</span>{" "}
                <span className="text-white/60">({Math.round((s.value / total) * 100)}%)</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-xs text-ink/65">
            <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: SERIES[i % SERIES.length] }} />
            {s.label}
            <span className="font-semibold text-ink tabular-nums">{fmt(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ring meter: a single headline percentage                            */
/* ------------------------------------------------------------------ */

export function RingMeter({
  value,
  size = 112,
  stroke = 10,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(Math.max(0, Math.min(100, value))));
    return () => cancelAnimationFrame(t);
  }, [value]);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label ?? "Progress"} ${value}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(19,48,45,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={SERIES[0]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-ink tabular-nums leading-none">{value}%</div>
        {sublabel && <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-ink/45">{sublabel}</div>}
      </div>
    </div>
  );
}
