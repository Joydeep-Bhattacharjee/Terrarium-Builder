import { useMemo } from 'react'
import { mulberry32 } from '../utils/noise.js'

// A small cluster of mushrooms: cream tapered stem + domed cap.
export default function Mushroom({ seed = 1 }) {
  const shrooms = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 71237) + 11)
    const caps = ['#a8492f', '#b5623b', '#7c4a2c', '#c47a4a']
    const n = 1 + Math.floor(rand() * 3)
    const out = []
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2
      const r = i === 0 ? 0 : 0.05 + rand() * 0.08
      const h = 0.16 + rand() * 0.16
      out.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h,
        capR: (0.06 + rand() * 0.04) * (0.9 + h),
        capColor: caps[Math.floor(rand() * caps.length)],
        tilt: (rand() - 0.5) * 0.3,
      })
    }
    return out
  }, [seed])

  return (
    <group>
      {shrooms.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]} rotation={[m.tilt, 0, m.tilt]}>
          {/* stem */}
          <mesh position={[0, m.h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.032, m.h, 10]} />
            <meshStandardMaterial color="#efe7d2" roughness={0.85} />
          </mesh>
          {/* cap */}
          <mesh position={[0, m.h, 0]} scale={[1, 0.62, 1]} castShadow>
            <sphereGeometry args={[m.capR, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={m.capColor} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
