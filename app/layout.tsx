import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import { RoleProvider } from "@/lib/role-context";
import PwaRegister from "@/components/pwa/pwa-register";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CARERLOOP | Multi-Tenant Care Management Platform",
    template: "%s | CARERLOOP",
  },
  description:
    "CarerLoop is a multi-tenant care management platform designed to help organisations that provide residential care manage their people, facilities, residents and everyday operations from one central system. Better Organised Care. Better Lives.",
  applicationName: "CARERLOOP",
  keywords: [
    "CarerLoop",
    "care management",
    "residential care",
    "care homes",
    "resident records",
    "healthcare management",
    "caregiver",
    "onboarding",
    "staff management",
  ],
  authors: [{ name: "CARERLOOP" }],
  creator: "CARERLOOP",
  publisher: "CARERLOOP",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CARERLOOP",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "CARERLOOP",
    title: "CARERLOOP - Better Organised Care. Better Lives.",
    description:
      "Centralised multi-tenant care management platform for residential care organisations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARERLOOP - Better Organised Care. Better Lives.",
    description:
      "Centralised multi-tenant care management platform for residential care organisations.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <RoleProvider>
            {children}
            <PwaRegister />
          </RoleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
