export default function HeroTypography() {
  return (
    <div className="flex flex-col">
      <h1
        className="font-serif leading-[1.05] tracking-tight"
        style={{
          fontSize: "clamp(40px, 4.5vw, 64px)",
          color: "var(--color-ink)",
        }}
      >
        Ayush
        <br />
        <span style={{ whiteSpace: "nowrap" }}>Singh Bhandari</span>
      </h1>
      <div
        style={{
          width: 55,
          height: 1,
          background: "var(--color-divider)",
          margin: "28px 0",
          opacity: 0.6,
        }}
      />
      <p
        className="font-sans"
        style={{
          fontSize: "clamp(16px, 1.2vw, 20px)",
          lineHeight: 1.45,
          color: "var(--color-divider)",
          maxWidth: "26ch",
        }}
      >
        Creating products where
        <br />
        design and engineering meet.
      </p>
    </div>
  );
}
