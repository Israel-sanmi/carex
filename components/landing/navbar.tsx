"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#roles" },
  { label: "Impact", href: "#impact" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg border-b border-ink/10 dark:border-emerald-500/10"
          : "bg-white/70 dark:bg-[#040e0f]/80 backdrop-blur-md border-b border-white/20 dark:border-white/5"
      }`}
    >
      {/* Subtle emerald horizon accent glow under navbar */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />

      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          onClick={(e) => handleSmoothScroll(e, "#top")}
          aria-label="CarerLoop home"
          className="cursor-pointer"
        >
          <Logo />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleSmoothScroll(e, l.href)}
                  className="text-sm font-medium text-ink/75 dark:text-slate-300 transition-colors hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Theme Toggle Button right by the menu */}
          <ThemeToggle />
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-semibold text-ink/80 dark:text-slate-300 hover:text-teal-brand dark:hover:text-emerald-400 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold px-5 py-2.5 text-sm transition-all shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 cursor-pointer"
          >
            Get started
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-ink dark:text-slate-200 cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink/10 dark:border-white/10 glass px-5 pb-6 pt-2 md:hidden animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                handleSmoothScroll(e, l.href);
              }}
              className="block py-3 text-base font-medium text-ink/80 dark:text-slate-200 hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-ink/10 dark:border-white/10">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm font-semibold text-ink dark:text-slate-200 hover:text-teal-brand dark:hover:text-emerald-400"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="w-full text-center rounded-full bg-emerald-600 dark:bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
