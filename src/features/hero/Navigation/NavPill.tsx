"use client";

const items = ["Home", "Projects", "Achievements", "Contact"];

export default function NavPill() {
  return (
    <nav
      className="flex items-center rounded-full border"
      style={{
        gap: 44,
        height: 52,
        paddingLeft: 36,
        paddingRight: 36,
        background: "var(--color-nav-bg)",
        borderColor: "var(--color-nav-border)",
      }}
      aria-label="Primary navigation"
    >
      {items.map((item) => (
        <button
          key={item}
          className="text-[17px] leading-none tracking-tight cursor-pointer font-medium"
          style={{ color: "var(--color-ink)" }}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
