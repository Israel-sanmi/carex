"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Cta() {
  return (
    <section id="get-started" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-br from-teal-950 via-slate-900 to-[#040e0f] text-white text-center">
          {/* Subtle faded photo texture in background */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
            <Image
              src="/images/team.jpg"
              alt="Care team background"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Ambient glowing radial orbs inside */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-white/10 shadow-xs">
              <HeartHandshake className="w-3.5 h-3.5" />
              Better Organised Care • Better Lives
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight leading-tight">
              Ready to bring calm back to <br className="hidden sm:inline" />
              <span className="font-serif italic font-normal text-emerald-400">
                your care operations?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience the difference an intuitive, human-centred care management platform makes. No high-pressure sales, no technical jargon—just a clear, dignified path to better residential care.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/register"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold text-base sm:text-lg transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-400/35 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
              >
                Get started
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full font-semibold text-base sm:text-lg transition-all backdrop-blur-md cursor-pointer w-full sm:w-auto"
              >
                Sign in to Dashboard
              </Link>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Free assisted onboarding
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Full legacy data migration
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No setup fees
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
