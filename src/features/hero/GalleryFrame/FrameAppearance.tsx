import Photograph from "./Photograph";
import HangingSystem from "./HangingSystem";

/**
 * FrameAppearance — the *visual* definition of the framed photograph.
 *
 * Purely presentational CSS-drawn premium black wooden gallery frame:
 *   .frame-body      → deep matte-black moulding with bevel, depth, edge lights
 *   .frame-mat       → thin off-white mat board (secondary, not dominant)
 *   .photo-window    → the photograph, the dominant interior element
 *   .glass-reflection→ independent glass streak driven by the physics loop
 *   .frame-cast-shadow / .frame-contact-shadow → independent, JS-driven shadows
 *
 * Contains ZERO physics or interaction logic. All motion is driven by the parent
 * physics controller (GalleryFrame / usePendulum), which rotates .frame-body and
 * composes the lagging shadow / glass / wire elements. Keeping appearance separate
 * from behaviour means interaction work can never restyle the frame again.
 */
export default function FrameAppearance({
  bodyRef,
  castRef,
  contactRef,
  glassRef,
  wireLeftRef,
  wireRightRef,
}: {
  bodyRef: React.Ref<HTMLDivElement>;
  castRef: React.Ref<HTMLDivElement>;
  contactRef: React.Ref<HTMLDivElement>;
  glassRef: React.Ref<HTMLDivElement>;
  wireLeftRef: React.Ref<SVGPathElement>;
  wireRightRef: React.Ref<SVGPathElement>;
}) {
  return (
    <div className="frame-stage relative w-full mx-auto">
      {/* Independent shadows, driven by JS so they lag + breathe with the swing. */}
      <div ref={castRef} className="frame-cast-shadow" aria-hidden="true" />
      <div ref={contactRef} className="frame-contact-shadow" aria-hidden="true" />

      <div ref={bodyRef} className="frame-body relative">
        {/* Black wooden moulding: thick profile, inner+outer bevel, edge lights. */}
        <div className="frame-moulding">
          {/* Thin mat board — secondary, simply frames the artwork. */}
          <div className="frame-mat">
            <div className="photo-window relative overflow-hidden">
              <Photograph />
            </div>
            {/* Artist's signature, quietly placed in the mat's bottom-right
               corner — discovered only by attentive viewers. Under the glazing,
               matte black, intentionally small. */}
            <img
              src="/signature.png"
              alt=""
              aria-hidden="true"
              className="frame-signature"
            />
          </div>
          {/* Hardware mounting into the wood. The shank lives INSIDE the moulding's
              stacking context and descends into the wooden top edge; the collar
              (same wood) paints over its base so the wood wraps the screw — the
              hardware physically intersects the frame, not merely overlaps it. */}
          <span className="hanging-shank hanging-shank-left" aria-hidden="true" />
          <span className="hanging-shank hanging-shank-right" aria-hidden="true" />
          <span className="hanging-collar hanging-collar-left" aria-hidden="true" />
          <span className="hanging-collar hanging-collar-right" aria-hidden="true" />
        </div>
        <div ref={glassRef} className="glass-reflection" aria-hidden="true" />

        {/* Wires terminate exactly at the frame's top edge. */}
        <HangingSystem wireLeftRef={wireLeftRef} wireRightRef={wireRightRef} />
      </div>
    </div>
  );
}
