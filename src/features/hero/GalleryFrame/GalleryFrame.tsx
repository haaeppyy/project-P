"use client";

import { useEffect, useRef } from "react";
import FrameAppearance from "./FrameAppearance";
import { usePendulum, MAX_ABS_DEG, type PendulumState } from "./usePendulum";

const REST_TILT = -0.12; // resting micro-imperfection (deg)
const MAX_ABS = MAX_ABS_DEG;

/**
 * GalleryFrame — the physics *controller* (FramePhysics layer).
 *
 * Owns no visual design. Mounts the visual-only FrameAppearance and drives a
 * single rotation on .frame-body about the suspension point defined in CSS (the
 * wire-meeting point above the frame). Independent shadow / glass / wire elements
 * lag and breathe with the swing for added mass.
 *
 * Pointer events become "hand force" through usePendulum:
 *   down → grab (soft spring couples hand to frame, frame lags / resists)
 *   move → push (update the spring target)
 *   up   → release (spring drops, angular velocity carries on)
 */
export default function GalleryFrame() {
  const { subscribe, grabStart, grabMove, grabEnd } = usePendulum();

  const bodyRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const wireLeftRef = useRef<SVGPathElement>(null);
  const wireRightRef = useRef<SVGPathElement>(null);

  // Single subscriber: write transforms to the rigid body + lagging elements.
  useEffect(() => {
    const write = (s: PendulumState) => {
      const a = s.angleDeg; // -MAX_ABS .. MAX_ABS (deg)
      const norm = a / MAX_ABS; // -1 .. 1

      if (bodyRef.current) {
        bodyRef.current.style.transform = `rotate(${(REST_TILT + a).toFixed(4)}deg)`;
        bodyRef.current.style.zIndex = Math.abs(norm) > 0.02 || s.grabbed ? "40" : "1";
      }

      // Cast shadow lags the body and rotates ~75% as much, slides a few px.
      if (castRef.current) {
        castRef.current.style.transform = `translate3d(${(30 + norm * 12).toFixed(1)}px, ${(38 + Math.abs(norm) * 7).toFixed(1)}px, 0) skewX(${(-3 - norm * 1.6).toFixed(2)}deg) rotate(${(a * 0.75).toFixed(3)}deg)`;
        castRef.current.style.opacity = (0.9 - Math.abs(norm) * 0.12).toFixed(3);
      }

      // Contact shadow darkens as the frame returns to the wall, fades as it leans off.
      if (contactRef.current) {
        contactRef.current.style.opacity = (0.1 - Math.abs(norm) * 0.04).toFixed(3);
      }

      // Glass reflection drifts a few px as the frame tilts, biased toward the
      // upper-left window source so it reads as the room's light, not a generic
      // slide. Fades slightly with orientation. Physics/timing untouched.
      if (glassRef.current) {
        const gx = (-norm * 14).toFixed(1);
        const gy = (norm * 6).toFixed(1);
        glassRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        glassRef.current.style.opacity = (0.38 - Math.abs(norm) * 0.08).toFixed(3);
      }

      // Wires splay slightly with the swing so the suspension reads physical.
      const splay = (norm * 3.5).toFixed(2);
      if (wireLeftRef.current) {
        wireLeftRef.current.setAttribute(
          "d",
          `M2 0 C ${2.9 + Number(splay)} 34, ${1.4 + Number(splay)} 68, 2 100`,
        );
      }
      if (wireRightRef.current) {
        wireRightRef.current.setAttribute(
          "d",
          `M2 0 C ${1.2 + Number(splay)} 33, ${2.7 + Number(splay)} 67, 2 100`,
        );
      }
    };
    return subscribe(write);
  }, [subscribe]);

  // Hand model: press = grab (soft spring), move = push, release = momentum.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture?.(e.pointerId);
      grabStart(e.clientX);
    };
    const onMove = (e: PointerEvent) => {
      grabMove(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      el.releasePointerCapture?.(e.pointerId);
      grabEnd();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [grabStart, grabMove, grabEnd]);

  return (
    <FrameAppearance
      bodyRef={bodyRef}
      castRef={castRef}
      contactRef={contactRef}
      glassRef={glassRef}
      wireLeftRef={wireLeftRef}
      wireRightRef={wireRightRef}
    />
  );
}
