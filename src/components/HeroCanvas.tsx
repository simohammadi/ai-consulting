import { useEffect, useRef } from "react"

interface HeroCanvasProps {
  style?: React.CSSProperties
  className?: string
}

const BG_COLOR = "#070708"
// Flow field: how tightly the field varies in space (smaller = larger swirls).
const NOISE_SCALE = 0.0013
// How fast the flow field evolves over time.
const NOISE_TIME_STEP = 0.0016
// Per-frame acceleration applied along the flow direction.
const FLOW_ACCEL = 0.14
// Velocity retained each frame (lower = more drag).
const DAMPING = 0.9
const MAX_SPEED = 2.6
// Radius (px) of the mouse's influence.
const MOUSE_RADIUS = 230
// Particles are pulled toward a ring of this radius around the cursor.
const RING_RADIUS = 82
// Strength of the pull toward each particle's slot on the ring.
const RADIAL_K = 0.03
// Strength of the tangential swirl around the cursor.
const SWIRL = 0.95
// Particles within this distance of each other push apart (anti-clumping).
const SEPARATION_RADIUS = 24
// Strength of the inter-particle repulsion.
const SEPARATION_K = 0.55
// Per-frame random jitter (Brownian motion) for entropy.
const BROWNIAN = 0.42

/**
 * Lightweight 3D value-noise (x, y plus an animated z/time axis).
 * No external deps; uses a seeded permutation table and smooth interpolation.
 */
class ValueNoise {
  private perm: Uint8Array

  constructor(seed = 1337) {
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    let s = seed >>> 0
    for (let i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0
      const j = s % (i + 1)
      const tmp = p[i]
      p[i] = p[j]
      p[j] = tmp
    }
    this.perm = new Uint8Array(512)
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]
  }

  private static fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  private hash(x: number, y: number, z: number): number {
    const p = this.perm
    return p[(p[(p[x & 255] + y) & 255] + z) & 255] / 255
  }

  noise(x: number, y: number, z: number): number {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const zi = Math.floor(z)
    const xf = x - xi
    const yf = y - yi
    const zf = z - zi

    const u = ValueNoise.fade(xf)
    const v = ValueNoise.fade(yf)
    const w = ValueNoise.fade(zf)

    const c000 = this.hash(xi, yi, zi)
    const c100 = this.hash(xi + 1, yi, zi)
    const c010 = this.hash(xi, yi + 1, zi)
    const c110 = this.hash(xi + 1, yi + 1, zi)
    const c001 = this.hash(xi, yi, zi + 1)
    const c101 = this.hash(xi + 1, yi, zi + 1)
    const c011 = this.hash(xi, yi + 1, zi + 1)
    const c111 = this.hash(xi + 1, yi + 1, zi + 1)

    const x00 = ValueNoise.lerp(c000, c100, u)
    const x10 = ValueNoise.lerp(c010, c110, u)
    const x01 = ValueNoise.lerp(c001, c101, u)
    const x11 = ValueNoise.lerp(c011, c111, u)

    const y0 = ValueNoise.lerp(x00, x10, v)
    const y1 = ValueNoise.lerp(x01, x11, v)

    return ValueNoise.lerp(y0, y1, w)
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  // Stable fallback angle so a particle never collapses into the exact center.
  seed: number
}

function HeroCanvas({ style, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const noise = new ValueNoise()
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let time = 0
    let rafId = 0
    let running = false

    // Smoothed mouse-influence strength (0 = dancing freely, 1 = full pull).
    const mouse = { x: 0, y: 0, lastMove: -Infinity }
    let strength = 0

    // Spatial hash grid (linked lists) for fast neighbour repulsion.
    const CELL = Math.max(1, SEPARATION_RADIUS)
    let gridCols = 0
    let gridRows = 0
    let heads = new Int32Array(0)
    let nextIdx = new Int32Array(0)
    // Cursor proximity per particle, written during the force pass and read
    // during the draw pass.
    let nearArr = new Float32Array(0)

    const spawn = (p: Particle) => {
      p.x = Math.random() * width
      p.y = Math.random() * height
      p.vx = 0
      p.vy = 0
      p.alpha = 0.12 + Math.random() * 0.22
      p.seed = Math.random() * Math.PI * 2
    }

    const initParticles = () => {
      const area = width * height
      const count = Math.floor(Math.min(1800, area / 900))
      particles = new Array(count)
      for (let i = 0; i < count; i++) {
        const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, alpha: 0, seed: 0 }
        spawn(p)
        particles[i] = p
      }
      nextIdx = new Int32Array(count)
      nearArr = new Float32Array(count)
    }

    // Bucket every particle into the spatial grid (rebuilt each frame).
    const buildGrid = () => {
      heads.fill(-1)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        let cx = Math.floor(p.x / CELL)
        let cy = Math.floor(p.y / CELL)
        if (cx < 0) cx = 0
        else if (cx >= gridCols) cx = gridCols - 1
        if (cy < 0) cy = 0
        else if (cy >= gridRows) cy = gridRows - 1
        const c = cy * gridCols + cx
        nextIdx[i] = heads[c]
        heads[c] = i
      }
    }

    // Accumulate the repulsion force on particle i from nearby particles.
    const separation = (i: number) => {
      const p = particles[i]
      let cx = Math.floor(p.x / CELL)
      let cy = Math.floor(p.y / CELL)
      if (cx < 0) cx = 0
      else if (cx >= gridCols) cx = gridCols - 1
      if (cy < 0) cy = 0
      else if (cy >= gridRows) cy = gridRows - 1

      let sx = 0
      let sy = 0
      const r2 = SEPARATION_RADIUS * SEPARATION_RADIUS
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        if (gy < 0 || gy >= gridRows) continue
        for (let gx = cx - 1; gx <= cx + 1; gx++) {
          if (gx < 0 || gx >= gridCols) continue
          let j = heads[gy * gridCols + gx]
          while (j !== -1) {
            if (j !== i) {
              const q = particles[j]
              const ddx = p.x - q.x
              const ddy = p.y - q.y
              const d2 = ddx * ddx + ddy * ddy
              if (d2 > 0 && d2 < r2) {
                const d = Math.sqrt(d2)
                const f = (1 - d / SEPARATION_RADIUS) / d
                sx += ddx * f
                sy += ddy * f
              }
            }
            j = nextIdx[j]
          }
        }
      }
      p.vx += sx * SEPARATION_K
      p.vy += sy * SEPARATION_K
    }

    // Pass 1: compute all velocities from frame-start positions (no movement
    // yet, so neighbour reads stay consistent).
    const computeForces = (i: number, mouseStrength: number) => {
      const p = particles[i]

      // Base "dance": accelerate along the evolving flow field.
      const flowAngle =
        noise.noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE, time) * Math.PI * 4
      p.vx += Math.cos(flowAngle) * FLOW_ACCEL
      p.vy += Math.sin(flowAngle) * FLOW_ACCEL

      // Brownian jitter — keeps the system noisy so it never reads as a clean
      // geometric circle.
      p.vx += (Math.random() - 0.5) * BROWNIAN
      p.vy += (Math.random() - 0.5) * BROWNIAN

      // Anti-clumping repulsion from neighbours.
      separation(i)

      let near = 0
      if (mouseStrength > 0.001) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < MOUSE_RADIUS) {
          const falloff = 1 - dist / MOUSE_RADIUS
          // Near the exact centre the angle is undefined, so fall back to the
          // particle's stable slot — prevents collapse into one pixel.
          const angle = dist > 1 ? Math.atan2(dy, dx) : p.seed
          const targetX = mouse.x + Math.cos(angle) * RING_RADIUS
          const targetY = mouse.y + Math.sin(angle) * RING_RADIUS
          p.vx += (targetX - p.x) * RADIAL_K * mouseStrength
          p.vy += (targetY - p.y) * RADIAL_K * mouseStrength
          p.vx += -Math.sin(angle) * SWIRL * falloff * mouseStrength
          p.vy += Math.cos(angle) * SWIRL * falloff * mouseStrength
          near = falloff * mouseStrength
        }
      }
      nearArr[i] = near

      p.vx *= DAMPING
      p.vy *= DAMPING

      const sp = Math.hypot(p.vx, p.vy)
      if (sp > MAX_SPEED) {
        p.vx = (p.vx / sp) * MAX_SPEED
        p.vy = (p.vy / sp) * MAX_SPEED
      }
    }

    // Pass 2: move and draw.
    const moveAndDraw = (i: number) => {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) p.x += width
      else if (p.x >= width) p.x -= width
      if (p.y < 0) p.y += height
      else if (p.y >= height) p.y -= height

      const near = nearArr[i]
      const a = Math.min(0.95, p.alpha + near * 0.75)
      const size = 1.4 + near * 2.2
      ctx.fillStyle = `rgba(232,232,235,${a})`
      ctx.fillRect(p.x, p.y, size, size)
    }

    const renderFrame = () => {
      // Fully clear each frame — particles dance without leaving any buildup.
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, width, height)

      const idle = performance.now() - mouse.lastMove
      const target = idle < 1500 ? 1 : 0
      strength += (target - strength) * 0.05

      buildGrid()
      for (let i = 0; i < particles.length; i++) computeForces(i, strength)
      for (let i = 0; i < particles.length; i++) moveAndDraw(i)
      time += NOISE_TIME_STEP
    }

    const loop = () => {
      if (!running) return
      renderFrame()
      rafId = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || prefersReducedMotion) return
      running = true
      rafId = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, width, height)

      gridCols = Math.max(1, Math.ceil(width / CELL))
      gridRows = Math.max(1, Math.ceil(height / CELL))
      heads = new Int32Array(gridCols * gridRows)

      initParticles()

      if (prefersReducedMotion) {
        for (let i = 0; i < 90; i++) renderFrame()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      if (mx >= 0 && my >= 0 && mx <= rect.width && my <= rect.height) {
        mouse.x = mx
        mouse.y = my
        mouse.lastMove = performance.now()
      }
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)

    let io: IntersectionObserver | null = null
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting && !document.hidden) start()
          else stop()
        },
        { threshold: 0 },
      )
      io.observe(canvas)
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    resize()
    if (!prefersReducedMotion && !document.hidden) start()

    return () => {
      stop()
      ro.disconnect()
      if (io) io.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

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
  )
}

export default HeroCanvas
