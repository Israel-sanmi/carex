"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "CARERLOOP PWA ServiceWorker registered with scope:",
              registration.scope,
            );
          })
          .catch((error) => {
            console.error(
              "CARERLOOP PWA ServiceWorker registration failed:",
              error,
            );
          });
      });
    }
  }, []);

  return null;
}
