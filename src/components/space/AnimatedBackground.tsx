import useScroll from "../../hooks/useScroll";
import nebula from "../../assets/nebula.jpg";

export function AnimatedBackground() {
  const y = useScroll();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center mix-blend-screen"
      style={{
        backgroundImage: `url(${nebula})`,
        transform: `scale(${1 + y * 0.0006})`,
        opacity: Math.max(0, 0.35 - y * 0.00025),
      }}
    />
  );
}
