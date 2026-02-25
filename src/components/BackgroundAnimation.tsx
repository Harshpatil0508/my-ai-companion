import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  colorIndex: number;
}

const DARK_COLORS = [
  "rgba(59, 130, 246, 0.4)",
  "rgba(139, 92, 246, 0.35)",
  "rgba(59, 130, 246, 0.2)",
  "rgba(139, 92, 246, 0.15)",
  "rgba(96, 165, 250, 0.25)",
];

const LIGHT_COLORS = [
  "rgba(37, 99, 235, 0.18)",
  "rgba(109, 40, 217, 0.15)",
  "rgba(37, 99, 235, 0.1)",
  "rgba(109, 40, 217, 0.08)",
  "rgba(59, 130, 246, 0.12)",
];

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      colorIndex: Math.floor(Math.random() * 5),
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isLight = resolvedTheme === "light";
    const colors = isLight ? LIGHT_COLORS : DARK_COLORS;
    const lineColor = isLight ? "rgba(109, 40, 217," : "rgba(139, 130, 246,";

    const auroraColors = isLight
      ? [
          ["rgba(37, 99, 235, 0.04)", "rgba(109, 40, 217, 0.02)"],
          ["rgba(109, 40, 217, 0.03)", "rgba(37, 99, 235, 0.015)"],
          ["rgba(16, 185, 129, 0.02)"],
        ]
      : [
          ["rgba(59, 130, 246, 0.06)", "rgba(139, 92, 246, 0.03)"],
          ["rgba(139, 92, 246, 0.05)", "rgba(59, 130, 246, 0.02)"],
          ["rgba(52, 211, 153, 0.03)"],
        ];

    const drawAurora = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      const grad1 = ctx.createRadialGradient(
        w * 0.3 + Math.sin(t * 0.0003) * w * 0.15,
        h * 0.2 + Math.cos(t * 0.0004) * h * 0.1, 0,
        w * 0.3, h * 0.2, w * 0.5
      );
      grad1.addColorStop(0, auroraColors[0][0]);
      grad1.addColorStop(0.5, auroraColors[0][1]);
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const grad2 = ctx.createRadialGradient(
        w * 0.7 + Math.cos(t * 0.0005) * w * 0.12,
        h * 0.6 + Math.sin(t * 0.0003) * h * 0.15, 0,
        w * 0.7, h * 0.6, w * 0.45
      );
      grad2.addColorStop(0, auroraColors[1][0]);
      grad2.addColorStop(0.5, auroraColors[1][1]);
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      const grad3 = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.0002) * w * 0.2,
        h * 0.8 + Math.cos(t * 0.0006) * h * 0.1, 0,
        w * 0.5, h * 0.8, w * 0.3
      );
      grad3.addColorStop(0, auroraColors[2][0]);
      grad3.addColorStop(1, "transparent");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 16;
      ctx.clearRect(0, 0, w, h);
      drawAurora(timeRef.current);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.02;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.999;
        p.vy *= 0.999;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const twinkle = 0.5 + Math.sin(timeRef.current * 0.002 + p.x * 0.01) * 0.5;
        const alpha = p.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.colorIndex].replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * (isLight ? 0.06 : 0.08);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${lineColor} ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default BackgroundAnimation;