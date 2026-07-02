import { useMemo } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '../utils/noise.js'

// Scallop sea shell: a ribbed, cupped fan with a hinge. Pearly material.
export default function SeaShell({ seed = 1 }) {
  const { geo, color } = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 90211) + 6)
    const segU = 40
    const segV = 18
    const R = 0.32
    const spread = Math.PI * 0.95
    const ribs = 9
    const pos = []
    const idx = []
    for (let i = 0; i <= segV; i++) {
      const v = i / segV
      const radius = v * R
      for (let j = 0; j <= segU; j++) {
        const u = j / segU
        const ang = (u - 0.5) * spread
        const rib = Math.sin(u * ribs * Math.PI) * 0.02 * v
        const cup = v * v * 0.14
        const x = radius * Math.sin(ang)
        const z = radius * Math.cos(ang) * 1.05
        const y = cup + rib
        pos.push(x, y, z)
      }
    }
    const cols = segU + 1
    for (let i = 0; i < segV; i++) {
      for (let j = 0; j < segU; j++) {
        const a = i * cols + j
        const b = a + 1
        const c = a + cols
        const d = c + 1
        idx.push(a, c, b, b, c, d)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    const palette = ['#f3e4d6', '#f7ddd0', '#efd9c2', '#f6e9dd']
    return { geo: g, color: palette[Math.floor(rand() * palette.length)] }
  }, [seed])

  return (
    <mesh geometry={geo} rotation={[0.12, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
