"use client";

import { useEffect } from "react";

/**
 * Scroll-triggered reveal — ports the IntersectionObserver from the old
 * static js/main.js. Adds `.visible` to every `.reveal` element as it enters
 * the viewport. Renders nothing.
 */
export default function Reveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 },
    );

    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
