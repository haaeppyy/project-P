"use client";

import { useEffect, useRef } from "react";

export default function LightingLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const update = () => {
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      layer.style.setProperty("--light-shift-x", `${currentX}px`);
      layer.style.setProperty("--light-shift-y", `${currentY}px`);
      frame = requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 34;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 24;
      targetY = pointerY;
    };

    const onScroll = () => {
      targetY = pointerY - Math.min(window.scrollY * 0.08, 20);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="lighting-layer" aria-hidden="true">
      <span className="moving-light-source" />
      <span className="moving-light-ray moving-light-ray-one" />
      <span className="moving-light-ray moving-light-ray-two" />
      <span className="moving-light-ray moving-light-ray-three" />
    </div>
  );
}
