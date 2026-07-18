"use client";

import { useEffect, useRef } from "react";

/**
 * Physically accurate COMPOUND (physical) pendulum for a framed photograph
 * hung from two steel wires.
 *
 * The frame is a rigid body of ~2 kg with distributed mass, so it has a genuine
 * rotational inertia I. It rotates about a fixed pivot (the point where the two
 * wires meet above the frame) and cannot translate.
 *
 *   Idle      → perfectly still, no work done.
 *   Grab      → a soft torsional spring couples the pointer to the frame. The
 *               frame resists (mass), lags behind the hand, never sticks to it.
 *   Drag      → the spring pulls the angle toward a pointer-derived target,
 *               clamped to the physical limit (±3°).
 *   Release   → the spring is removed; the frame keeps its current angular
 *               velocity (momentum) and gravity gradually pulls it back — it
 *               overshoots, reverses, and decays like a real hanging clock.
 *   Rest      → the sim stops only when the mechanical ENERGY is negligible,
 *               never on a timer.
 *
 * Equation of motion (about the pivot):
 *   I·α = −m·g·d·sin(θ) − c·ω  [ + k·(θ_target − θ) while grabbed ]
 *
 * where d is the pivot→centre-of-mass distance. I is larger than a point mass on
 * a string, which is exactly why the swing is slow, heavy and stable.
 *
 * Integrated every frame in a single rAF loop; output is written straight to
 * element refs by subscribers (no React re-render → transform/opacity/filter
 * only, 60 FPS).
 */

export interface PendulumState {
  angleDeg: number;
  angularVelocity: number; // deg/s
  settled: boolean;
  grabbed: boolean;
}

type Subscriber = (s: PendulumState) => void;

const DEG = Math.PI / 180;

export const MAX_ABS_DEG = 3; // absolute physical swing limit
export const NORMAL_DEG = 1.5; // typical interaction stays under this

function rand(): number {
  return Math.random();
}
function randSigned(): number {
  return rand() * 2 - 1;
}

interface Config {
  mass: number; // kg
  gravity: number; // m/s^2
  comDist: number; // m, pivot -> centre of mass
  inertia: number; // kg·m^2, rotational inertia about pivot
  damping: number; // N·m·s/rad
  springK: number; // N·m/rad, drag coupling
}

function makeConfig(): Config {
  // 2–5% natural variance per interaction so no two are identical.
  const vary = (base: number, pct: number) => base * (1 + randSigned() * pct);
  return {
    mass: vary(2.0, 0.05),
    gravity: 9.81,
    comDist: vary(0.12, 0.03),
    // Distributed-mass inertia — tuned for a heavy ~1.5s period.
    inertia: vary(0.14, 0.04),
    // Light-ish damping: several decaying swings settling in ~3.5–4.5s.
    damping: vary(0.25, 0.05),
    // SOFT coupling while dragging: the frame lags the hand noticeably (heavier
    // with faster movement), so the interaction reads as applying force to a
    // heavy suspended object rather than grabbing a UI handle.
    springK: vary(0.7, 0.04),
  };
}

// Pointer horizontal travel (px) -> target angle (rad). 100px ≈ 1° of *target*
// the hand is asking for; the soft spring + inertia mean the frame reaches
// only a fraction of that while being pushed, and overshoots past it on a flick.
const PX_TO_RAD = 0.01 * DEG;

export function usePendulum() {
  const subs = useRef<Set<Subscriber>>(new Set());
  const state = useRef<PendulumState>({
    angleDeg: 0,
    angularVelocity: 0,
    settled: true,
    grabbed: false,
  });
  const cfg = useRef<Config>(makeConfig());
  const rafRef = useRef<number | null>(null);
  const lastT = useRef<number>(0);
  const emittedSettled = useRef<boolean>(true);

  // Drag bookkeeping.
  const grab = useRef({
    active: false,
    startAngleDeg: 0, // frame angle when grabbed
    startPointerX: 0, // pointer x when grabbed
    targetRad: 0, // current spring target (rad)
    lastPointerX: 0, // previous pointer x (for hand-velocity estimate)
    handVel: 0, // px/s, smoothed hand horizontal velocity
    releaseHoldUntil: 0, // ms: brief momentum continuation window
  });

  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onChange = () => {
      reduced.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const subscribers = subs.current;

    const step = (t: number) => {
      rafRef.current = requestAnimationFrame(step);
      if (!lastT.current) lastT.current = t;
      let dt = (t - lastT.current) / 1000;
      lastT.current = t;
      if (dt > 0.05) dt = 0.05; // clamp after a stall
      if (dt <= 0) return;

      const s = state.current;
      const c = cfg.current;
      const g = grab.current;

      const idle = s.settled && !s.grabbed;
      if (idle && emittedSettled.current) return; // truly at rest: no work

      const substeps = 3;
      const h = dt / substeps;
      for (let i = 0; i < substeps; i++) {
        const theta = s.angleDeg * DEG;
        const omega = s.angularVelocity * DEG; // rad/s

        // Gravity restoring torque of a compound pendulum + viscous damping.
        let torque =
          -c.mass * c.gravity * c.comDist * Math.sin(theta) - c.damping * omega;

        // While grabbed, a soft torsional spring couples the hand to the frame.
        if (s.grabbed) {
          torque += c.springK * (g.targetRad - theta);
        }

        const alpha = torque / c.inertia; // rad/s^2
        const newOmega = omega + alpha * h;
        s.angularVelocity = newOmega / DEG;
        s.angleDeg += s.angularVelocity * h;

        // Hard physical limit — steel wires cannot let it swing past this.
        if (s.angleDeg > MAX_ABS_DEG) {
          s.angleDeg = MAX_ABS_DEG;
          if (s.angularVelocity > 0) s.angularVelocity *= -0.25;
        } else if (s.angleDeg < -MAX_ABS_DEG) {
          s.angleDeg = -MAX_ABS_DEG;
          if (s.angularVelocity < 0) s.angularVelocity *= -0.25;
        }
      }

      // Energy-based rest: stop when mechanical energy is negligible (never on
      // a timer). Only when not grabbed.
      if (!s.grabbed) {
        const omega = s.angularVelocity * DEG;
        const theta = s.angleDeg * DEG;
        const energy =
          0.5 * c.inertia * omega * omega +
          c.mass * c.gravity * c.comDist * (1 - Math.cos(theta));
        if (energy < 2e-6) {
          s.angleDeg = 0;
          s.angularVelocity = 0;
          s.settled = true;
          cfg.current = makeConfig(); // fresh variance for next interaction
        } else {
          s.settled = false;
        }
      }

      subscribers.forEach((fn) => fn(s));
      if (s.settled && !s.grabbed) emittedSettled.current = true;
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastT.current = 0;
    };
  }, []);

  // ---- Interaction API (hand model) --------------------------------------

  /** Pointer down: grab the frame with the torsional spring. */
  const grabStart = (pointerX: number) => {
    if (reduced.current) return;
    const s = state.current;
    const g = grab.current;
    g.active = true;
    g.startAngleDeg = s.angleDeg;
    g.startPointerX = pointerX;
    g.lastPointerX = pointerX;
    g.handVel = 0;
    g.targetRad = s.angleDeg * DEG;
    s.grabbed = true;
    s.settled = false;
    emittedSettled.current = false;
    lastT.current = 0;
  };

  /** Pointer move while held: update the spring target from hand travel. */
  const grabMove = (pointerX: number) => {
    const g = grab.current;
    if (!g.active) return;
    const dx = pointerX - g.startPointerX;
    // Smoothed hand velocity (px/s). Used at release to "throw" the frame:
    // a fast flick transfers the hand's motion into swing amplitude.
    const dt = 1 / 60;
    const inst = (pointerX - g.lastPointerX) / dt;
    g.handVel = g.handVel * 0.6 + inst * 0.4;
    g.lastPointerX = pointerX;
    // Target = angle at grab + hand travel, clamped to the physical limit.
    let target = g.startAngleDeg * DEG + dx * PX_TO_RAD;
    const lim = MAX_ABS_DEG * DEG;
    if (target > lim) target = lim;
    if (target < -lim) target = -lim;
    g.targetRad = target;
  };

  /**
   * Pointer up: release. The spring is NOT removed instantly — for a short
   * window (20–50 ms, randomised) the hand's coupling lingers so the frame
   * carries through with its momentum before gravity takes over. This tiny
   * continuation is what the brain reads as mass.
   */
  const grabEnd = () => {
    const g = grab.current;
    const s = state.current;
    if (!g.active) return;
    g.active = false;
    const hold = 20 + rand() * 30; // 20–50 ms

    // Keep the spring target frozen at the last hand position during the hold,
    // then drop it. Implemented by scheduling the actual release.
    window.setTimeout(() => {
      // Only release if a new grab hasn't started meanwhile.
      if (!grab.current.active) {
        s.grabbed = false;
        // "Throw": the hand was moving, so the frame carries that motion on
        // release — a flick overshoots, a slow release barely moves. This is
        // the momentum transfer that reads as mass. Hand px/s -> deg/s.
        const throwDegPerSec = g.handVel * (PX_TO_RAD / DEG) * 0.25;
        s.angularVelocity += throwDegPerSec;
        // Slight per-release variance in retained momentum (2–5%).
        s.angularVelocity *= 1 + randSigned() * 0.035;
        lastT.current = 0;
      }
    }, hold);
  };

  const subscribe = (fn: Subscriber) => {
    subs.current.add(fn);
    return () => {
      subs.current.delete(fn);
    };
  };

  return { subscribe, grabStart, grabMove, grabEnd };
}
