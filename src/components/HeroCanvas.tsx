import { useEffect, useRef } from "react";

interface HeroCanvasProps {
  style?: React.CSSProperties;
  className?: string;
}

const BG_COLOR = "#070708";
// Trail fade: a translucent dark rect painted each frame instead of clearing.
const TRAIL_ALPHA = 0.06;
// How tightly the flow field varies in space; smaller = larger, smoother swirls.
const NOISE_SCALE = 0.0016;
// How fast the field evolves over time (the z/time dimension).
const NOISE_TIME_SCALE = 0.00009;
// Particle speed in px per frame.
const PARTICLE_SPEED = 0.9;
// Frames before a particle respawns at a random spot (keeps the field churning).
const MAX_PARTICLE_LIFE = 320;

/**
 * Lightweight 3D value-noise (x, y plus an animated z/time axis).
 * No external deps; uses a seeded permutation table and smooth interpolation.
 */
class ValueNoise {
  private perm: Uint8Array;

  constructor(seed = 1337) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    // Deterministic shuffle driven by a small LCG so results are stable.
    let s = seed >>> 0;
    for (let i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = s % (i + 1);
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private static fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private hash(x: number, y: number, z: number): number {
    const p = this.perm;
    const h = p[(p[(p[x & 255] + y) & 255] + z) & 255];
    // Map to a smooth scalar in [0, 1).
    return h / 255;
  }

  /** Returns smooth noise in roughly [0, 1]. */
  noise(x: number, y: number, z: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = ValueNoise.fade(xf);
    const v = ValueNoise.fade(yf);
    const w = ValueNoise.fade(zf);

    const c000 = this.hash(xi, yi, zi);
    const c100 = this.hash(xi + 1, yi, zi);
    const c010 = this.hash(xi, yi + 1, zi);
    const c110 = this.hash(xi + 1, yi + 1, zi);
    const c001 = this.hash(xi, yi, zi + 1);
    const c101 = this.hash(xi + 1, yi, zi + 1);
    const c011 = this.hash(xi, yi + 1, zi + 1);
    const c111 = this.hash(xi + 1, yi + 1, zi + 1);

    const x00 = ValueNoise.lerp(c000, c100, u);
    const x10 = ValueNoise.lerp(c010, c110, u);
    const x01 = ValueNoise.lerp(c001, c101, u);
    const x11 = ValueNoise.lerp(c011, c111, u);

    const y0 = ValueNoise.lerp(x00, x10, v);
    const y1 = ValueNoise.lerp(x01, x11, v);

    return ValueNoise.lerp(y0, y1, w);
  }
}

interface Particle {
  x: number;
  y: number;
  life: number;
  alpha: number;
}

function HeroCanvas({ style, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const noise = new ValueNoise();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let time = 0;
    let rafId = 0;
    let running = false;

    const randomAlpha = () => 0.04 + Math.random() * 0.06;

    const spawnParticle = (p: Particle) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.life = Math.random() * MAX_PARTICLE_LIFE;
      p.alpha = randomAlpha();
    };

    const initParticles = () => {
      const area = width * height;
      const count = Math.floor(Math.min(2200, area / 650));
      particles = new Array(count);
      for (let i = 0; i < count; i++) {
        const p: Particle = { x: 0, y: 0, life: 0, alpha: 0 };
        spawnParticle(p);
        particles[i] = p;
      }
    };

    const paintBase = () => {
      // Full opaque base wipe (used on (re)size and for the static frame).
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);
    };

    const drawVignette = () => {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, "rgba(7,7,8,0)");
      grad.addColorStop(1, "rgba(7,7,8,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    const stepParticles = () => {
      ctx.fillStyle = "rgba(255,255,255,1)";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle =
          noise.noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE, time) *
          Math.PI *
          4;
        p.x += Math.cos(angle) * PARTICLE_SPEED;
        p.y += Math.sin(angle) * PARTICLE_SPEED;
        p.life -= 1;

        if (
          p.life <= 0 ||
          p.x < 0 ||
          p.x >= width ||
          p.y < 0 ||
          p.y >= height
        ) {
          spawnParticle(p);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
    };

    const renderFrame = () => {
      // Translucent dark overlay creates the smoky trails.
      ctx.fillStyle = `rgba(7,7,8,${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, width, height);
      stepParticles();
      time += NOISE_TIME_SCALE * width;
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || prefersReducedMotion) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintBase();
      drawVignette();
      initParticles();

      if (prefersReducedMotion) {
        // Render a representative static frame, then stop.
        for (let i = 0; i < 80; i++) renderFrame();
        drawVignette();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && !document.hidden) {
            start();
          } else {
            stop();
          }
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    if (!prefersReducedMotion && !document.hidden) start();

    return () => {
      stop();
      ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: BG_COLOR,
        ...style,
      }}
    />
  );
}

export default HeroCanvas;
