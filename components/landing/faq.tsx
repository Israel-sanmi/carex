"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./reveal";
import { Sparkle, Blob } from "./illustrations";

const faqs = [
  {
    q: "How long does it take to get our care homes set up?",
    a: "Most organisations are up and running within a single afternoon. You can add your care homes, create room numbers, and invite your managers and caregivers via email in just a few clicks.",
  },
  {
    q: "Can our caregivers use it on their existing phones or tablets?",
    a: "Yes. CarerLoop is designed for any mobile phone, iPad, or Android tablet. Staff don't have to visit an app store - they simply tap 'Add to Home Screen' and CarerLoop works just like a native app, even if connectivity is spotty.",
  },
  {
    q: "Can one manager or caregiver work across multiple homes?",
    a: "Absolutely. CarerLoop supports multi-role users. A staff member can be a registered nurse at one care home and an administrator or manager at another, switching contexts without separate logins.",
  },
  {
    q: "How does CarerLoop handle resident admissions?",
    a: "Admissions follow a simple, clear workflow. Families or residents submit their details, receive a unique registration reference, verify their email, and then your team reviews and assigns them to the right room and bed.",
  },
  {
    q: "How is our resident and care data protected?",
    a: "Every organisation's data is strictly isolated. One care provider can never see or access another organisation's residents, staff, or notes. Role-based permissions also ensure staff only see what is relevant to their duties.",
  },
  {
    q: "Do we need IT experts to manage or maintain it?",
    a: "No special hardware or IT maintenance is needed. CarerLoop runs in your web browser with automatic updates, secure cloud backups, and responsive support whenever you need a hand.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      {/* Background soft blob */}
      <Blob className="pointer-events-none absolute -right-48 -bottom-32 h-[450px] w-[450px] text-mint/40" />
      <Sparkle className="pointer-events-none absolute left-12 top-20 h-6 w-6 text-coral/40" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-coral">Common questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/65">
              Everything you need to know about getting started with CarerLoop.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-3.5">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={item.q}>
                <div
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-teal-brand/30 bg-cream/70 shadow-xs"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-medium text-ink">
                      {item.q}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-200 ${
                        isOpen
                          ? "bg-teal-brand text-white rotate-180"
                          : "bg-ink/5 text-ink/70"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 sm:px-6 text-sm sm:text-base leading-relaxed text-ink/70 animate-fade-in border-t border-ink/5">
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Support note */}
        <Reveal>
          <div className="mt-12 text-center text-sm text-ink/60">
            Have a question not answered here?{" "}
            <a
              href="mailto:hello@carerloop.com"
              className="font-medium text-teal-brand underline decoration-teal-brand/40 underline-offset-4 hover:decoration-teal-brand"
            >
              Get in touch with our team
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
