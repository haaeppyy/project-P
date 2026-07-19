import Image from "next/image";
import type { Ref } from "react";

interface HangingSystemProps {
  wireLeftRef?: Ref<SVGPathElement>;
  wireRightRef?: Ref<SVGPathElement>;
}

/**
 * HangingSystem — purely visual suspension hardware rendered ABOVE .frame-body.
 *
 * Positioned with bottom:100% so it sits in the gap between the body top and the
 * pivot point (the wire-meeting crown). Wires run from the two pins down to the
 * exact top edge of the frame, so the frame clearly reads as suspended — no
 * floating gap. Wire paths are ref-driven so the physics loop can splay them.
 */
export default function HangingSystem({ wireLeftRef, wireRightRef }: HangingSystemProps) {
  return (
    <div className="hanging-system absolute inset-x-0 pointer-events-none" aria-hidden="true">
      <span className="hanging-pin hanging-pin-left" />
      <span className="hanging-pin hanging-pin-right" />

      {/* Wires span the full height of the suspension region, terminating at the
          frame's top edge (the bottom of this layer). */}
      <svg
        className="hanging-wire hanging-wire-left"
        viewBox="0 0 4 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={wireLeftRef} d="M2 0 C 2.9 34, 1.4 68, 2 100" />
      </svg>
      <svg
        className="hanging-wire hanging-wire-right"
        viewBox="0 0 4 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={wireRightRef} d="M2 0 C 1.2 33, 2.7 67, 2 100" />
      </svg>

      {/* Anchor plates: where each wire meets the frame's top edge, so the
          connection reads as engineered rather than floating. */}
      <span className="hanging-anchor hanging-anchor-left" />
      <span className="hanging-anchor hanging-anchor-right" />

      <div className="hanging-crown absolute flex items-center justify-center">
        <Image
          src="/pineappleCrown.svg"
          alt=""
          width={92}
          height={58}
          sizes="92px"
          style={{ width: "clamp(52px, 4vw, 74px)", height: "auto", display: "block" }}
        />
      </div>
    </div>
  );
}
