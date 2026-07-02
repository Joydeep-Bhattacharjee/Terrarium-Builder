import { useMemo } from 'react'
import * as THREE from 'three'
import { makeSucculentLeaf } from './leafGeometry.js'
import { mulberry32 } from '../utils/noise.js'

// Echeveria: a tight rosette of chunky succulent leaves in concentric rings,
// smallest and most upright at the centre. Green or red-tipped variant.
export default function Echeveria({ seed = 1, variant = 'green' }) {
  const bodyColor = variant === 'red' ? '#8fae63' : '#7ba36d'
  const tipColor = variant === 'red' ? '#c0475a' : '#c58a72'

  const rings = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 44971) + 4)
    const geo = makeSucculentLeaf({ length: 0.44, width: 0.28, bodyColor, tipColor })
    // ring: count, pitch (tilt up from horizontal), radial scale, y offset
    const def = [
      { n: 8, pitch: 0.35, s: 1.0, y: 0.0 },
      { n: 7, pitch: 0.7, s: 0.78, y: 0.04 },
      { n: 6, pitch: 1.05, s: 0.55, y: 0.08 },
      { n: 4, pitch: 1.35, s: 0.34, y: 0.11 },
    ]
    let offset = rand() * Math.PI
    const arr = []
    def.forEach((ring) => {
      for (let i = 0; i < ring.n; i++) {
        const ang = offset + (i / ring.n) * Math.PI * 2 + rand() * 0.15
        arr.push({
          rotY: ang,
          pitch: ring.pitch + (rand() - 0.5) * 0.12,
          scale: ring.s * (0.9 + rand() * 0.18),
          y: ring.y,
        })
      }
      offset += 0.5
    })
    return { geo, arr }
  }, [seed, variant])

  return (
    <group>
      {rings.arr.map((l, i) => (
        <group key={i} rotation={[0, l.rotY, 0]}>
          <mesh
            geometry={rings.geo}
            rotation={[-Math.PI / 2 + l.pitch, 0, 0]}
            position={[0, l.y, 0]}
            scale={l.scale}
            castShadow
          >
            <meshStandardMaterial vertexColors roughness={0.5} metalness={0} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
