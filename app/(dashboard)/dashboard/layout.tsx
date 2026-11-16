"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="dash-scope relative min-h-screen bg-[#f6f8f7] font-sans text-ink selection:bg-sun/60 flex">
      {/* Ambient background */}
      <div className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 lg:left-72 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none fixed -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="relative flex-1 flex flex-col min-w-0 lg:pl-72">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="dash-main flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Keyed by route so the entrance animation replays on navigation */}
          <div key={pathname} className="dash-page">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
