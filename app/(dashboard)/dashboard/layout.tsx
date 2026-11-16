"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

// Sidebar collapse preference, persisted in localStorage.
const COLLAPSE_KEY = "carerloop:sidebar-collapsed";
const COLLAPSE_EVENT = "carerloop:sidebar-collapsed-change";

function subscribeCollapse(cb: () => void) {
  window.addEventListener(COLLAPSE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(COLLAPSE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const readCollapse = () => localStorage.getItem(COLLAPSE_KEY) === "1";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribeCollapse, readCollapse, () => false);

  const toggleCollapse = useCallback(() => {
    localStorage.setItem(COLLAPSE_KEY, readCollapse() ? "0" : "1");
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  }, []);

  return (
    <div className="dash-scope relative min-h-screen bg-[#f5f7f6] font-sans text-ink selection:bg-sun/60">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_55%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed -top-48 right-[-10rem] w-[42rem] h-[42rem] rounded-full bg-emerald-200/35 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-[-14rem] left-1/3 w-[36rem] h-[36rem] rounded-full bg-sun-soft/60 blur-3xl" aria-hidden="true" />

      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div
        className={`relative flex min-h-screen flex-col min-w-0 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="dash-main flex-1 px-4 py-5 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {/* Keyed by route so the entrance animation replays on navigation */}
          <div key={pathname} className="dash-page">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
