import { useMemo } from 'react'
import * as THREE from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'

// Build a closed cross-section outline (radius, y) and revolve it into a
// solid-walled glass jar so the walls have real thickness → real refraction.
function useJarGeometry() {
  return useMemo(() => {
    const p = []
    const v = (r, y) => p.push(new THREE.Vector2(r, y))

    const outerR = 1.28
    const innerR = 1.21
    const rimR = 1.15
    const yBottom = -1.78
    const yInnerFloor = -1.55
    const yRim = 1.5

    // outer floor -> outer wall -> rim -> inner wall -> inner floor
    v(0.0, yBottom)
    v(0.95, yBottom)
    v(1.15, yBottom + 0.04)
    v(outerR, yBottom + 0.2) // rounded outer corner
    v(outerR, yRim - 0.18)
    v(outerR, yRim - 0.02)
    v(outerR - 0.02, yRim) // rim top outer
    v(rimR + 0.02, yRim) // rim top inner
    v(rimR, yRim - 0.03)
    v(innerR, yRim - 0.2)
    v(innerR, yInnerFloor + 0.22)
    v(1.02, yInnerFloor + 0.03) // rounded inner corner
    v(0.9, yInnerFloor)
    v(0.0, yInnerFloor)

    const geo = new THREE.LatheGeometry(p, 96)
    geo.computeVertexNormals()
    return geo
  }, [])
}

export default function Jar() {
  const geo = useJarGeometry()
  return (
    <mesh geometry={geo} castShadow renderOrder={2}>
      <MeshTransmissionMaterial
        transmission={1}
        thickness={0.55}
        roughness={0.04}
        ior={1.48}
        chromaticAberration={0.03}
        anisotropy={0.1}
        distortion={0.15}
        distortionScale={0.25}
        temporalDistortion={0.0}
        clearcoat={1}
        clearcoatRoughness={0.05}
        attenuationColor="#eaf4f0"
        attenuationDistance={4}
        backside
        backsideThickness={0.3}
        samples={6}
        resolution={512}
        color="#ffffff"
      />
    </mesh>
  )
}
