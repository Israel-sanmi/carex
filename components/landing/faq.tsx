"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How long does it take to migrate our existing records?",
    answer:
      "We provide a structured, secure template for bulk uploading existing resident and staff data. Most residential homes complete their full migration within an afternoon, with dedicated CarerLoop onboarding specialists on standby to assist.",
  },
  {
    question: "Do caregivers need to download an app from the App Store?",
    answer:
      "No. CarerLoop operates natively as an offline-first Progressive Web App (PWA). Frontline staff can simply add the site to their home screen on any iOS, Android, or Windows tablet. It works without app store restrictions or IT hurdles.",
  },
  {
    question: "Is our residents' data truly secure and isolated?",
    answer:
      "Absolutely. We enforce bank-level AES-256 encryption at rest and in transit, strict multi-tenant boundary checks, and role-based permissions. Resident files and audit logs remain securely partitioned so no organisation ever sees another group's private data.",
  },
  {
    question:
      "Can an organisation manage multiple care homes from one account?",
    answer:
      "Yes. CarerLoop was engineered from day one for multi-home care providers. Organisation Administrators can view real-time occupancy and compliance across all group facilities, while Care Home Managers remain scoped to their assigned facility.",
  },
  {
    question: "Does CarerLoop support CQC inspection requirements?",
    answer:
      "Yes. CarerLoop maintains an immutable cryptographic audit ledger (Section 4.9) that logs every vital observation, medication record, and care plan change with timestamp and actor identity, making CQC Regulation 17 audits fast and transparent.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass dark:border-white/10 text-xs font-semibold text-teal-deep dark:text-emerald-400 mb-4 shadow-xs">
            <span>Clarifications</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-ink dark:text-white font-heading tracking-tight">
            Questions? <span className="gradient-text">We have answers.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`glass-card rounded-md border overflow-hidden transition-all duration-500 ${
                  isOpen
                    ? "border-emerald-500/40 shadow-lg shadow-emerald-900/5"
                    : "border-white/80 dark:border-white/10 shadow-xs hover:border-emerald-500/20"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`hidden sm:grid place-items-center w-8 h-8 rounded-md text-xs font-mono font-bold shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900/5 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {f.question}
                  </span>
                  <span
                    className={`grid place-items-center w-8 h-8 rounded-full shrink-0 transition-all duration-300 ${
                      isOpen ? "bg-emerald-500/10 rotate-180" : ""
                    }`}
                  >
                    <ChevronDown
                      className={`w-5 h-5 ${isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 sm:pl-18 pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
