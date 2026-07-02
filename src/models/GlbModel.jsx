import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Loads a custom .glb (admin-provided URL), normalizes it to ~0.5 units tall,
// and rests its base at y=0 so it sits on the soil like the built-ins.
export default function GlbModel({ url }) {
  const { scene } = useGLTF(url)
  const object = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const target = 0.55
    const s = target / maxDim
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s)
    clone.scale.setScalar(s)
    clone.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return <primitive object={object} />
}
