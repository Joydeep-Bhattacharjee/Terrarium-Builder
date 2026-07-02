import * as THREE from 'three'

// Build a single organic leaf lying along +Z, width along X, base at origin.
// Vertex-colored with a midrib "vein" tint. Slight arch + cup for realism.
export function makeLeaf({
  length = 0.5,
  width = 0.22,
  curl = 0.18,
  cup = 0.5,
  edgeColor = '#4f7a2e',
  veinColor = '#9fd06a',
}) {
  const segL = 12
  const segW = 6
  const pos = []
  const col = []
  const idx = []
  const cEdge = new THREE.Color(edgeColor)
  const cVein = new THREE.Color(veinColor)

  for (let i = 0; i <= segL; i++) {
    const t = i / segL
    // leaf outline: 0 at base+tip, widest around the middle
    const w = width * Math.pow(Math.sin(Math.PI * Math.min(t * 1.05, 1)), 0.7)
    for (let j = 0; j <= segW; j++) {
      const s = (j / segW) * 2 - 1 // -1..1 across
      const x = s * w
      const z = t * length
      const y = curl * (t * t) * length - cup * w * (s * s) * 0.6
      pos.push(x, y, z)
      const c = cVein.clone().lerp(cEdge, Math.min(1, Math.abs(s) * 1.1))
      col.push(c.r, c.g, c.b)
    }
  }
  const cols = segW + 1
  for (let i = 0; i < segL; i++) {
    for (let j = 0; j < segW; j++) {
      const a = i * cols + j
      const b = a + 1
      const c = a + cols
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}
