// Lightweight deterministic value noise — no deps. Good enough for organic
// soil surface displacement and scatter jitter.

export function hash2(x, y, seed = 0) {
  let h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return h - Math.floor(h)
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

// 2D value noise in [-1, 1]
export function noise2(x, y, seed = 0) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash2(xi, yi, seed)
  const b = hash2(xi + 1, yi, seed)
  const c = hash2(xi, yi + 1, seed)
  const d = hash2(xi + 1, yi + 1, seed)
  const u = smooth(xf)
  const v = smooth(yf)
  const val = a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
  return val * 2 - 1
}

// Fractal (fBm) — layered noise for richer surface.
export function fbm(x, y, seed = 0, octaves = 3) {
  let amp = 1
  let freq = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(x * freq, y * freq, seed + i * 17)
    norm += amp
    amp *= 0.5
    freq *= 2.1
  }
  return sum / norm
}

// Seeded PRNG for per-instance jitter.
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
