"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";

const links = [
  { label: "Features", href: "#features" },
  { label: "Daily Flow", href: "#shift-flow" },
  { label: "Impact", href: "#impact" },
  { label: "Who it's for", href: "#who" },
  { label: "Stories", href: "#stories" },
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
          ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(19,48,45,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          onClick={(e) => handleSmoothScroll(e, "#top")}
          aria-label="CarerLoop home"
          className="cursor-pointer"
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleSmoothScroll(e, l.href)}
                className="text-[15px] text-ink/70 transition-colors hover:text-ink cursor-pointer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="px-3 py-2 text-[15px] font-medium text-ink/80 hover:text-ink"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep cursor-pointer"
          >
            Get started
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink md:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-cream px-5 pb-6 pt-2 md:hidden animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                handleSmoothScroll(e, l.href);
              }}
              className="block py-3 text-base text-ink/80 hover:text-ink cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex gap-3">
            <a
              href="/login"
              className="flex-1 rounded-full border border-ink/15 py-2.5 text-center text-sm font-medium text-ink"
            >
              Sign in
            </a>
            <a
              href="/register"
              className="flex-1 rounded-full bg-ink py-2.5 text-center text-sm font-medium text-white cursor-pointer"
            >
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
