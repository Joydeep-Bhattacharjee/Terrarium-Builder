import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { fbm } from '../utils/noise.js'
import { JAR } from '../data/inventory.js'

// Radial disc mesh for the soil top surface, displaced with fBm so it is
// uneven and organic. Also carries subtle per-vertex color grain.
function makeDiscGeometry(radius, grain, seed, baseColor) {
  const rings = 24
  const sectors = 48
  const positions = []
  const colors = []
  const indices = []
  const col = new THREE.Color(baseColor)

  const heightAt = (rr, ang) => {
    const x = Math.cos(ang) * rr
    const z = Math.sin(ang) * rr
    let h = fbm(x * 1.6, z * 1.6, seed, 3) * grain
    // dip slightly near the glass (meniscus feel)
    const edge = rr / radius
    h -= edge * edge * grain * 0.9
    return h
  }

  // center vertex
  positions.push(0, heightAt(0, 0), 0)
  pushColor(colors, col, 0)

  for (let i = 1; i <= rings; i++) {
    const rr = radius * (i / rings)
    for (let j = 0; j < sectors; j++) {
      const ang = (j / sectors) * Math.PI * 2
      const x = Math.cos(ang) * rr
      const z = Math.sin(ang) * rr
      positions.push(x, heightAt(rr, ang), z)
      pushColor(colors, col, (fbm(x * 4, z * 4, seed + 9, 2)) * 0.16)
    }
  }

  const idx = (ring, sec) => (ring === 0 ? 0 : 1 + (ring - 1) * sectors + (sec % sectors))
  // center fan
  for (let j = 0; j < sectors; j++) {
    indices.push(0, idx(1, j), idx(1, j + 1))
  }
  // ring quads
  for (let i = 1; i < rings; i++) {
    for (let j = 0; j < sectors; j++) {
      const a = idx(i, j)
      const b = idx(i, j + 1)
      const c = idx(i + 1, j)
      const d = idx(i + 1, j + 1)
      indices.push(a, c, b, b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function pushColor(arr, base, delta) {
  const c = base.clone()
  const f = 1 + delta
  arr.push(
    THREE.MathUtils.clamp(c.r * f, 0, 1),
    THREE.MathUtils.clamp(c.g * f, 0, 1),
    THREE.MathUtils.clamp(c.b * f, 0, 1)
  )
}

export default function SubstrateLayer({ layer, isTop, mode, onPlace }) {
  const topRef = useRef()
  const radius = JAR.innerRadius * 0.99
  const topY = layer.baseY + layer.thickness
  const wallH = layer.thickness

  const discGeo = useMemo(
    () => makeDiscGeometry(radius, layer.grain, layer.seed, layer.color),
    [radius, layer.grain, layer.seed, layer.color]
  )

  const interactive = isTop && mode === 'decorate'

  return (
    <group>
      {/* soil wall (visible through glass) */}
      <mesh position={[0, layer.baseY + wallH / 2, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.985, wallH, 48, 1, true]} />
        <meshStandardMaterial
          color={layer.color}
          roughness={layer.roughness}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* uneven top surface — raycast target for placement */}
      <mesh
        ref={topRef}
        geometry={discGeo}
        position={[0, topY, 0]}
        receiveShadow
        onPointerDown={
          interactive
            ? (e) => {
                e.stopPropagation()
                onPlace?.(e.point, e.face?.normal)
              }
            : undefined
        }
      >
        <meshStandardMaterial
          vertexColors
          roughness={layer.roughness}
          metalness={0}
        />
      </mesh>
    </group>
  )
}
