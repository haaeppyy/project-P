export default function HangingSystem() {
  return (
    <div
      className="absolute inset-x-0 pointer-events-none"
      style={{ top: "-18%", height: "18%" }}
    >
      {/* Real extracted hanging hardware (pins + wire), behind the crown */}
      <img
        src="/hanging-hardware.png"
        alt=""
        className="absolute inset-x-0 bottom-0 w-full"
        style={{ height: "auto", objectFit: "contain", zIndex: 1, pointerEvents: "none" }}
      />

      {/* Crown — centered between the wires, above the hardware layer */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          bottom: -2,
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <img
          src="/pineappleCrown.svg"
          alt=""
          style={{
            width: "clamp(48px, 5vw, 72px)",
            height: "auto",
            display: "block",
            color: "#1a1a1a",
            fill: "#1a1a1a",
          }}
        />
      </div>
    </div>
  );
}
