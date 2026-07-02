import { useMemo } from 'react'
import * as THREE from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'

// Build a closed cross-section outline (radius, y) and revolve it into a
// solid-walled glass jar so the walls have real thickness → real refraction.
function useJarGeometry() {
  return useMemo(() => {
    const p = []
    const v = (r, y) => p.push(new THREE.Vector2(r, y))

    // Rounded fishbowl: flattish base -> bulging belly -> incurved rim.
    // Closed cross-section (outer up-and-over, inner down) => real glass wall.
    // outer profile: base center -> out -> belly -> rim
    v(0.0, -1.52)
    v(0.68, -1.52)
    v(1.05, -1.4)
    v(1.36, -1.06)
    v(1.5, -0.42) // belly (widest)
    v(1.5, -0.12)
    v(1.42, 0.42)
    v(1.28, 0.86)
    v(1.2, 1.12)
    v(1.22, 1.2) // rim top outer
    // rim + inner profile back down to inner base center
    v(1.12, 1.2) // rim top inner
    v(1.12, 1.08)
    v(1.2, 0.82)
    v(1.34, 0.4)
    v(1.42, -0.12)
    v(1.42, -0.42) // inner belly
    v(1.28, -1.02)
    v(0.98, -1.34)
    v(0.6, -1.4) // inner base
    v(0.0, -1.4)

    const geo = new THREE.LatheGeometry(p, 128)
    geo.computeVertexNormals()
    return geo
  }, [])
}

export default function Jar() {
  const geo = useJarGeometry()
  return (
    <mesh geometry={geo} castShadow renderOrder={2} raycast={() => null}>
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
