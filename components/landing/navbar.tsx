"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#roles" },
  { label: "Impact", href: "#impact" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll state + reading progress (written straight to the DOM to avoid re-renders)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 pt-3">
      <div
        className={`relative mx-auto max-w-7xl rounded-md transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg shadow-emerald-950/5 border border-slate-200/70 dark:border-emerald-500/10"
            : "bg-transparent border border-transparent"
        }`}
      >
        <nav className="flex h-16 items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            onClick={(e) => handleSmoothScroll(e, "#top")}
            aria-label="CarerLoop home"
          >
            <Logo />
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const isActive = active === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => handleSmoothScroll(e, l.href)}
                    className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-ink/70 dark:text-slate-300 hover:text-ink dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 animate-scale-in" />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-300 hover:text-teal-brand dark:hover:text-emerald-400 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="shine group inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold px-5 py-2.5 text-sm transition-all shadow-md shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              Get started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 text-ink dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block w-6 h-6">
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-75" : ""}`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${open ? "" : "opacity-0 -rotate-90 scale-75"}`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Reading progress */}
        <div className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full pointer-events-none">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden mx-auto max-w-7xl overflow-hidden transition-all duration-300 ease-out ${
          open ? "mt-2 max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass rounded-md border border-slate-200/70 dark:border-white/10 shadow-xl p-3">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                handleSmoothScroll(e, l.href);
              }}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`block rounded-md px-4 py-3 text-base font-medium text-ink/80 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-teal-brand dark:hover:text-emerald-400 transition-all ${
                open ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
              }`}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 pt-3 border-t border-ink/10 dark:border-white/10">
            <Link
              href="/login"
              className="text-center rounded-md py-2.5 text-sm font-semibold text-ink dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-center rounded-md bg-emerald-600 dark:bg-emerald-500 py-2.5 text-sm font-semibold text-white dark:text-slate-950 shadow-sm hover:bg-emerald-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
