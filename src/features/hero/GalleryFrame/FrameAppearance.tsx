import Photograph from "./Photograph";
import HangingSystem from "./HangingSystem";

/**
 * FrameAppearance — the *visual* definition of the framed photograph.
 *
 * This component is purely presentational. It renders the real extracted black
 * wooden frame PNG, the photograph sitting in the cutout window, and the hanging
 * hardware (pins + wire + crown) above it. It owns NO physics and NO behaviour.
 *
 * All motion is applied by the parent physics controller (GalleryFrame), which
 * rotates this whole subtree as a single rigid body about the suspension point.
 * Keeping appearance separate from behaviour means interaction work can never
 * accidentally restyle the frame again.
 */
export default function FrameAppearance() {
  return (
    <div className="relative w-full mx-auto">
      <HangingSystem />
      {/* Container sized to frame-extracted.png's natural aspect ratio.
          No forced aspect-ratio, no background fill — fully transparent
          outside the moulding. The frame PNG defines the box; the photo
          layers on top inside the cutout window. */}
      <div
        className="relative w-full mx-auto"
        style={{
          maxWidth: "100%",
          boxShadow:
            "0 48px 100px -32px rgba(0,0,0,0.3), 0 16px 40px -20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Real extracted frame + mat texture. Renders at natural proportions
            (block + w-full + h-auto), defining the container height. */}
        <img
          src="/frame-extracted.png"
          alt=""
          className="block w-full h-auto"
          style={{ pointerEvents: "none" }}
        />
        {/* Photograph fills the transparent cutout window inside the frame. */}
        <Photograph />
      </div>
    </div>
  );
}
