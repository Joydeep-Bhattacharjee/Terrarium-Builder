import { useMemo } from 'react'
import * as THREE from 'three'
import { fbm, mulberry32 } from '../utils/noise.js'

// Dragon stone: a craggy, pitted rock. Displaced icosahedron, flat bottom.
export default function DragonStone({ seed = 1 }) {
  const geo = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 33211) + 2)
    const g = new THREE.IcosahedronGeometry(0.3, 4)
    const pos = g.attributes.position
    const v = new THREE.Vector3()
    const sx = 0.9 + rand() * 0.5
    const sy = 0.6 + rand() * 0.3
    const sz = 0.9 + rand() * 0.5
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const n = fbm(v.x * 4 + seed, v.z * 4 - seed, seed, 4)
      const n2 = fbm(v.y * 8, v.x * 8, seed + 4, 3)
      let r = 1 + n * 0.32 + n2 * 0.12
      v.multiplyScalar(r)
      v.x *= sx
      v.y *= sy
      v.z *= sz
      // flatten the bottom so it rests on the soil
      if (v.y < -0.05) v.y = -0.05 + (v.y + 0.05) * 0.15
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    g.translate(0, 0.16, 0)
    return g
  }, [seed])

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#5b544e" roughness={0.98} metalness={0.02} flatShading />
    </mesh>
  )
}
