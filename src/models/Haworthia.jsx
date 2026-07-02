import { useMemo } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '../utils/noise.js'

// Haworthia: rosette of stiff, upright, pointed triangular leaves. Dark green,
// thick (fat squashed cones) and steeply angled upward from the centre.
export default function Haworthia({ seed = 1 }) {
  const { geo, leaves } = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 61813) + 12)
    // cone pointing +Z, base at origin, flattened a little (leaf-like)
    const g = new THREE.ConeGeometry(0.07, 0.44, 7)
    g.translate(0, 0.22, 0) // base at y=0, apex at +Y
    g.rotateX(Math.PI / 2) // now base at origin, apex toward +Z
    g.scale(1, 0.7, 1) // thinner top-to-bottom => blade-like

    const rings = [
      { n: 7, pitch: 0.5, len: 1.0, y: 0.0 },
      { n: 6, pitch: 0.85, len: 0.78, y: 0.03 },
      { n: 4, pitch: 1.2, len: 0.55, y: 0.06 },
    ]
    let offset = rand() * Math.PI
    const arr = []
    rings.forEach((ring) => {
      for (let i = 0; i < ring.n; i++) {
        const ang = offset + (i / ring.n) * Math.PI * 2 + rand() * 0.12
        arr.push({
          rotY: ang,
          pitch: ring.pitch + (rand() - 0.5) * 0.1,
          scale: ring.len * (0.9 + rand() * 0.2),
          y: ring.y,
        })
      }
      offset += 0.45
    })
    return { geo: g, leaves: arr }
  }, [seed])

  return (
    <group>
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.rotY, 0]}>
          {/* tilt upward: rotate around X so +Z blade lifts toward the sky */}
          <mesh
            geometry={geo}
            rotation={[-l.pitch, 0, 0]}
            position={[0, l.y, 0]}
            scale={l.scale}
            castShadow
          >
            <meshStandardMaterial color="#33562b" roughness={0.55} metalness={0} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
