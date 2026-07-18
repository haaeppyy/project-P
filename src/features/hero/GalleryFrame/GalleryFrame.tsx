"use client";

import { useEffect, useRef } from "react";
import FrameAppearance from "./FrameAppearance";
import { usePendulum, MAX_ABS_DEG, type PendulumState } from "./usePendulum";

const REST_TILT = -0.12; // resting micro-imperfection (deg)
const MAX_ABS = MAX_ABS_DEG;

/**
 * GalleryFrame — the physics *controller*.
 *
 * It owns no visual design. It mounts the (visual-only) FrameAppearance inside a
 * single rigid wrapper and drives exactly one transform on that wrapper: a
 * rotation about the suspension point above the frame. Every pixel inside the
 * frame is a child of this wrapper and therefore moves as one rigid body.
 *
 * Pointer events are translated into "hand force" through the usePendulum hook:
 *   down  → grab (soft spring couples hand to frame, frame lags / resists)
 *   move  → push (update the spring target)
 *   up    → release (spring drops, current angular velocity carries on)
 */
export default function GalleryFrame() {
  const { subscribe, grabStart, grabMove, grabEnd } = usePendulum();

  const rigidRef = useRef<HTMLDivElement>(null);

  // Single subscriber: write ONE rigid-body transform. No child ever computes
  // its own transform.
  useEffect(() => {
    const write = (s: PendulumState) => {
      const a = s.angleDeg; // -MAX_ABS .. MAX_ABS (deg)
      const norm = a / MAX_ABS; // -1 .. 1
      if (rigidRef.current) {
        rigidRef.current.style.transform = `rotate(${(REST_TILT + a).toFixed(4)}deg)`;
      }
      // While active, keep the frame above the copy; settle back at rest.
      if (rigidRef.current) {
        rigidRef.current.style.zIndex = Math.abs(norm) > 0.02 || s.grabbed ? "40" : "2";
      }
    };
    return subscribe(write);
  }, [subscribe]);

  // Hand model: press = grab (soft spring), move = push, release = momentum.
  useEffect(() => {
    const el = rigidRef.current;
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
    <div
      ref={rigidRef}
      className="frame-rigid relative w-full"
      style={{
        cursor: "grab",
        touchAction: "none",
        // Pivot at the suspension point: the top-centre of the wrapper, i.e. the
        // hook where the wires meet above the frame. The frame swings from here.
        transformOrigin: "50% 0%",
      }}
    >
      <FrameAppearance />
    </div>
  );
}
