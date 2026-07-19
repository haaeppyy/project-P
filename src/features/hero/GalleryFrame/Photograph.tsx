"use client";

import dynamic from "next/dynamic";

const LiquidHover = dynamic(() => import("./LiquidHover"), { ssr: false });

export default function Photograph() {
  return (
    <>
      {/* Static fallback (also the SSR/no-WebGL paint). */}
      <img
        src="/heroImage.png"
        alt="Portrait photograph"
        className="block h-full w-full"
        style={{ display: "block", objectFit: "cover" }}
      />
      {/* Liquid distortion overlay, scoped to the hero photograph only. */}
      <LiquidHover imageSrc="/heroImage.png" resolution={10} cursorSize={50} intensity={26} />
    </>
  );
}
