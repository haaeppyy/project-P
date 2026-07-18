export default function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <span
        className="font-sans uppercase tracking-[0.28em]"
        style={{ fontSize: 10, color: "var(--color-muted)" }}
      >
        Scroll Down
      </span>
      <div className="relative flex flex-col items-center">
        <div
          className="rounded-full border flex justify-center"
          style={{
            width: 18,
            height: 28,
            borderColor: "var(--color-muted)",
            borderWidth: 1,
            paddingTop: 5,
          }}
        >
          <span
            className="rounded-full"
            style={{ width: 3, height: 3, background: "var(--color-muted)" }}
          />
        </div>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{ marginTop: 4 }}
        >
          <path d="M1 1L5 5L9 1" stroke="var(--color-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
