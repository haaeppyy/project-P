export default function Photograph() {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: "8%",
        bottom: "8%",
        left: "8%",
        right: "8%",
      }}
    >
      <img
        src="/heroImage.png"
        alt="Portrait photograph"
        className="w-full h-full"
        style={{ display: "block", objectFit: "cover" }}
      />
    </div>
  );
}
