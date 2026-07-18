import type { ReactNode } from "react";
import NavPill from "./Navigation/NavPill";
import ThemeToggle from "./Navigation/ThemeToggle";
import HeroTypography from "./HeroTypography";
import ScrollCue from "./ScrollIndicator/ScrollCue";
import LightingLayer from "./Lighting/LightingLayer";

interface HeroLayoutProps {
  frame: ReactNode;
}

export default function HeroLayout({ frame }: HeroLayoutProps) {
  return (
    <section
      className="hero-shell relative w-full min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero section"
    >
      <div className="wall-grain" aria-hidden="true" />
      <LightingLayer />

      {/* Header: nav + toggle */}
      <header
        className="hero-header w-full flex items-center justify-between z-20 relative"
      >
        <div className="absolute left-1/2 -translate-x-1/2">
          <NavPill />
        </div>
        <ThemeToggle />
      </header>

      {/* Main composition: text left, frame right */}
      <div className="hero-main relative flex-1 w-full flex items-center">
        <div
          className="hero-composition w-full flex items-center justify-start"
        >
          {/* Left: typography column */}
          <div className="hero-copy flex-shrink-0">
            <HeroTypography />
          </div>

          {/* Right: the featured frame */}
          <div className="hero-frame-column flex-shrink-0 flex flex-col items-center">
            {frame}

            {/* Scroll indicator below frame — 56px gap for breathing room */}
            <div className="scroll-cue-wrap">
              <ScrollCue />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
