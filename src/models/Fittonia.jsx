import { useMemo } from 'react'
import * as THREE from 'three'
import { makeLeaf } from './leafGeometry.js'
import { mulberry32 } from '../utils/noise.js'

// Fittonia: a low rosette of veined leaves. Pink or green nerve variant.
export default function Fittonia({ seed = 1, variant = 'pink' }) {
  const veinColor = variant === 'pink' ? '#e88fb0' : '#cfe6a0'
  const edgeColor = variant === 'pink' ? '#3f6a2a' : '#43712c'

  const leaves = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 54321) + 3)
    const geo = makeLeaf({ length: 0.42, width: 0.24, curl: 0.22, cup: 0.6, edgeColor, veinColor })
    const arr = []
    const rings = [
      { n: 5, tilt: 0.65, len: 1.0, y: 0.02 },
      { n: 7, tilt: 0.95, len: 0.82, y: 0.0 },
    ]
    let offset = rand() * Math.PI
    rings.forEach((ring) => {
      for (let i = 0; i < ring.n; i++) {
        const ang = offset + (i / ring.n) * Math.PI * 2 + rand() * 0.2
        const s = ring.len * (0.85 + rand() * 0.3)
        arr.push({
          rotY: ang,
          tilt: ring.tilt + rand() * 0.15,
          scale: s,
          y: ring.y,
        })
      }
      offset += 0.4
    })
    return { geo, arr }
  }, [seed, variant])

  return (
    <group>
      {leaves.arr.map((l, i) => (
        <group key={i} rotation={[0, l.rotY, 0]}>
          <mesh
            geometry={leaves.geo}
            rotation={[-Math.PI / 2 + l.tilt, 0, 0]}
            position={[0, l.y, 0]}
            scale={l.scale}
            castShadow
          >
            <meshStandardMaterial vertexColors roughness={0.6} metalness={0} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
