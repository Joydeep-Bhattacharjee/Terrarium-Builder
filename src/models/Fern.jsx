import { useMemo } from 'react'
import * as THREE from 'three'
import { makeLeaf } from './leafGeometry.js'
import { mulberry32 } from '../utils/noise.js'

// Small fern: several arching fronds, each a stem lined with paired leaflets.
export default function Fern({ seed = 1 }) {
  const data = useMemo(() => {
    const rand = mulberry32(Math.floor(seed * 13337) + 5)
    const leafGeo = makeLeaf({
      length: 0.18,
      width: 0.06,
      curl: 0.05,
      cup: 0.3,
      edgeColor: '#31541f',
      veinColor: '#5c8b34',
    })
    const fronds = []
    const nFronds = 5
    for (let f = 0; f < nFronds; f++) {
      const dir = (f / nFronds) * Math.PI * 2 + rand() * 0.3
      const reach = 0.5 + rand() * 0.2
      const rise = 0.55 + rand() * 0.2
      // arching curve: up then bend outward
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(dir) * reach * 0.25, rise * 0.6, Math.sin(dir) * reach * 0.25),
        new THREE.Vector3(Math.cos(dir) * reach * 0.7, rise, Math.sin(dir) * reach * 0.7),
        new THREE.Vector3(Math.cos(dir) * reach, rise * 0.85, Math.sin(dir) * reach),
      ])
      const stemGeo = new THREE.TubeGeometry(curve, 20, 0.012, 5, false)
      // leaflets along the stem
      const leaflets = []
      const n = 9
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1)
        const p = curve.getPoint(t)
        const tan = curve.getTangent(t).normalize()
        const scale = (1 - t * 0.6) * (0.9 + rand() * 0.2)
        // two leaflets, left and right of the stem
        for (const side of [-1, 1]) {
          const up = new THREE.Vector3(0, 1, 0)
          const sideVec = new THREE.Vector3().crossVectors(tan, up).normalize().multiplyScalar(side)
          const m = new THREE.Matrix4()
          const look = new THREE.Vector3().copy(p).add(sideVec)
          m.lookAt(p, look, up)
          const q = new THREE.Quaternion().setFromRotationMatrix(m)
          leaflets.push({ position: p.toArray(), quaternion: [q.x, q.y, q.z, q.w], scale })
        }
      }
      fronds.push({ stemGeo, leaflets })
    }
    return { leafGeo, fronds }
  }, [seed])

  return (
    <group>
      {data.fronds.map((fr, i) => (
        <group key={i}>
          <mesh geometry={fr.stemGeo} castShadow>
            <meshStandardMaterial color="#3c5a26" roughness={0.7} />
          </mesh>
          {fr.leaflets.map((lf, j) => (
            <mesh
              key={j}
              geometry={data.leafGeo}
              position={lf.position}
              quaternion={lf.quaternion}
              scale={lf.scale}
              castShadow
            >
              <meshStandardMaterial vertexColors roughness={0.65} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
