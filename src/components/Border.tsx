export default function Border() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.15) 65%, rgba(0, 0, 0, 0.55) 90%)",
      }}
    />
  );
}