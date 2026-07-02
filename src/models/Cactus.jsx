import { useMemo } from 'react'
import * as THREE from 'three'
import { Instances, Instance } from '@react-three/drei'
import { mulberry32 } from '../utils/noise.js'

// Build one ribbed cactus ball (mammillaria-style) with tubercle bumps.
function makeBody(radius, rand) {
  const g = new THREE.SphereGeometry(radius, 40, 30)
  const pos = g.attributes.position
  const v = new THREE.Vector3()
  const ribs = 9 + Math.floor(rand() * 4)
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const lon = Math.atan2(v.z, v.x)
    const lat = Math.acos(THREE.MathUtils.clamp(v.y / radius, -1, 1))
    const bump = Math.abs(Math.sin(lon * ribs * 0.5)) * 0.05 + Math.sin(lat * 14) * 0.012
    v.multiplyScalar(1 + bump)
    v.y *= 1.12 // slightly taller than wide
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  g.translate(0, radius * 1.0, 0)
  return g
}

export default function Cactus({ seed = 1 }) {
  const { bodies, spines } = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 22193) + 8)
    const n = 1 + Math.floor(rand() * 3)
    const bodies = []
    const spines = []
    for (let k = 0; k < n; k++) {
      const r = (0.16 + rand() * 0.1) * (k === 0 ? 1.25 : 1)
      const a = rand() * Math.PI * 2
      const dist = k === 0 ? 0 : 0.12 + rand() * 0.1
      const cx = Math.cos(a) * dist
      const cz = Math.sin(a) * dist
      bodies.push({ geo: makeBody(r, rand), x: cx, z: cz, r })
      // scatter little white spines over the body
      const count = 26 + Math.floor(rand() * 14)
      for (let i = 0; i < count; i++) {
        const u = rand() * Math.PI * 2
        const phi = Math.acos(1 - rand() * 1.1)
        const rr = r * 1.06
        const px = cx + Math.sin(phi) * Math.cos(u) * rr
        const pz = cz + Math.sin(phi) * Math.sin(u) * rr
        const py = r * 1.0 + Math.cos(phi) * rr * 1.12
        const nrm = new THREE.Vector3(px - cx, py - r * 1.0, pz - cz).normalize()
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm)
        spines.push({ position: [px, py, pz], quaternion: [q.x, q.y, q.z, q.w] })
      }
    }
    return { bodies, spines }
  }, [seed])

  return (
    <group>
      {bodies.map((b, i) => (
        <mesh key={i} geometry={b.geo} position={[b.x, 0, b.z]} castShadow receiveShadow>
          <meshStandardMaterial color="#4f7a43" roughness={0.62} metalness={0} />
        </mesh>
      ))}
      <Instances limit={220} castShadow>
        <coneGeometry args={[0.006, 0.045, 5]} />
        <meshStandardMaterial color="#f3ecd8" roughness={0.7} />
        {spines.map((s, i) => (
          <Instance key={i} position={s.position} quaternion={s.quaternion} />
        ))}
      </Instances>
    </group>
  )
}
