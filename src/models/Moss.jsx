import { useMemo } from 'react'
import * as THREE from 'three'
import { Instances, Instance } from '@react-three/drei'
import { mulberry32 } from '../utils/noise.js'

// Cushion moss: a low bumpy dome of many small green blobs.
export default function Moss({ seed = 1 }) {
  const blobs = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 99991) + 7)
    const out = []
    const count = 46
    const greens = ['#4f6b2e', '#5f7d3f', '#6d8a45', '#7f9b5b', '#43602a']
    for (let i = 0; i < count; i++) {
      // pack blobs in a dome
      const a = rand() * Math.PI * 2
      const r = Math.sqrt(rand()) * 0.32
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const domeY = Math.cos((r / 0.32) * (Math.PI / 2)) * 0.16
      const y = domeY * (0.7 + rand() * 0.5) + 0.02
      const s = 0.05 + rand() * 0.06
      out.push({
        position: [x, y, z],
        scale: [s, s * (0.8 + rand() * 0.4), s],
        color: greens[Math.floor(rand() * greens.length)],
      })
    }
    return out
  }, [seed])

  return (
    <group>
      <Instances limit={64} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.95} metalness={0} flatShading />
        {blobs.map((b, i) => (
          <Instance key={i} position={b.position} scale={b.scale} color={b.color} />
        ))}
      </Instances>
    </group>
  )
}
