import { useEffect, useRef } from "react";

/** Fullscreen 3D starfield. Scrolling moves the camera forward through space. */
export function SpaceFlight() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const N = 1400;
    const DEPTH = 2000;
    const tints = [
      "255,244,230",
      "200,225,255",
      "255,215,170",
      "180,240,240",
      "255,255,255",
    ];
    const stars = Array.from({ length: N }, () => ({
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      z: Math.random() * DEPTH,
      t: tints[(Math.random() * tints.length) | 0],
      s: Math.random() * 1.4 + 0.3,
    }));
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0;
    let lastScroll = window.scrollY,
      velocity = 0,
      mx = 0,
      my = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / w - 0.5) * 40;
      my = (e.clientY / h - 0.5) * 40;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    const frame = () => {
      const sy = window.scrollY;
      const delta = sy - lastScroll;
      lastScroll = sy;
      velocity += (delta * 2.2 - velocity) * 0.12;
      const speed = 0.6 + velocity; // gentle drift + scroll thrust
      ctx.fillStyle = "rgba(5,8,14,0.55)";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2 - mx,
        cy = h / 2 - my;
      const f = w * 0.45;
      for (const st of stars) {
        const pz = st.z;
        st.z -= speed;
        if (st.z < 1) {
          st.z += DEPTH;
          continue;
        }
        if (st.z > DEPTH) {
          st.z -= DEPTH;
          continue;
        }
        const x = cx + (st.x / st.z) * f,
          y = cy + (st.y / st.z) * f;
        if (x < -50 || x > w + 50 || y < -50 || y > h + 50) continue;
        const px = cx + (st.x / pz) * f,
          py = cy + (st.y / pz) * f;
        const near = 1 - st.z / DEPTH;
        const a = Math.min(1, near * 1.3);
        const r = st.s * (near * 2.2 + 0.2);
        const streak = Math.hypot(x - px, y - py);
        if (streak > 1.5) {
          ctx.strokeStyle = `rgba(${st.t},${a})`;
          ctx.lineWidth = r;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${st.t},${a})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
