"use client";

import Logo from "./logo";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#040e0f]/90 backdrop-blur-md z-10 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-ink/70 dark:text-slate-400 max-w-sm leading-relaxed">
              Care management, made calm. Built with{" "}
              <Heart className="w-4 h-4 inline text-coral fill-current" /> for those who care.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-ink dark:text-white mb-4 font-heading">Product</h4>
            <ul className="space-y-2.5 text-sm text-ink/70 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Features & Workflow
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Role Solutions
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Impact & ROI
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-ink dark:text-white mb-4 font-heading">Platform</h4>
            <ul className="space-y-2.5 text-sm text-ink/70 dark:text-slate-400">
              <li>
                <Link href="/login" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Self Registration
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                  Live Dashboard
                </Link>
              </li>
               <li>
                <Link href="/dashboard" className="hover:text-teal-brand dark:hover:text-emerald-400 transition-colors">
                   CQC & GDPR Compliant
                </Link>
              </li>
              {/* <li>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                 
                </span>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-ink dark:text-white mb-4 font-heading">Legal & Privacy</h4>
            <ul className="space-y-2.5 text-sm text-ink/70 dark:text-slate-400">
              <li>
                <span className="hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer">GDPR Statement</span>
              </li>
              <li>
                <span className="hover:text-teal-brand dark:hover:text-emerald-400 cursor-pointer">CQC Audit Compliance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/10 dark:border-white/10 pt-8 text-xs text-ink/50 dark:text-slate-500 text-center">
          © 2026 CarerLoop. All rights reserved. Better Organised Care. Better Lives.
        </div>
      </div>
    </footer>
  );
}
