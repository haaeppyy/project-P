import type { ReactNode } from "react";
import NavPill from "./Navigation/NavPill";
import ThemeToggle from "./Navigation/ThemeToggle";
import HeroTypography from "./HeroTypography";
import ScrollCue from "./ScrollIndicator/ScrollCue";

interface HeroLayoutProps {
  frame: ReactNode;
}

export default function HeroLayout({ frame }: HeroLayoutProps) {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col"
      style={{ background: "var(--color-wall)" }}
      aria-label="Hero section"
    >
      {/* Header: nav + toggle */}
      <header
        className="w-full flex items-center justify-between z-20 relative"
        style={{ padding: "48px 2.4vw 0" }}
      >
        <div className="flex-shrink-0 w-[120px]" aria-hidden="true" />
        <div className="absolute left-1/2 -translate-x-1/2">
          <NavPill />
        </div>
        <ThemeToggle />
      </header>

      {/* Main composition: text left, frame right */}
      <div className="relative flex-1 w-full flex items-center">
        <div
          className="w-full flex items-center justify-start"
          style={{
            gap: "clamp(24px, 5vw, 96px)",
            paddingLeft: "10vw",
            paddingRight: "6vw",
          }}
        >
          {/* Left: typography column */}
          <div
            className="flex-shrink-0"
            style={{ width: "clamp(260px, 28vw, 360px)" }}
          >
            <HeroTypography />
          </div>

          {/* Right: the featured frame */}
          <div
            className="flex-shrink-0 flex flex-col items-center"
            style={{ width: "clamp(260px, 32vw, 420px)" }}
          >
            {frame}

            {/* Scroll indicator below frame — 56px gap for breathing room */}
            <div style={{ marginTop: 56 }}>
              <ScrollCue />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
