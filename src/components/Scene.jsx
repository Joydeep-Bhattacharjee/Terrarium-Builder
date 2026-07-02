import { useCallback } from 'react'
import * as THREE from 'three'
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from '@react-three/drei'
import Jar from './Jar.jsx'
import SubstrateLayer from './SubstrateLayer.jsx'
import Decorations from './Decorations.jsx'
import { useStore } from '../store/useStore.js'
import { JAR, DECORATIONS } from '../data/inventory.js'

export default function Scene() {
  const layers = useStore((s) => s.layers)
  const mode = useStore((s) => s.mode)
  const selectedItem = useStore((s) => s.selectedItem)
  const customItems = useStore((s) => s.customItems)
  const addDecoration = useStore((s) => s.addDecoration)

  const resolveItem = useCallback(
    (id) => DECORATIONS.find((d) => d.id === id) || customItems.find((d) => d.id === id),
    [customItems]
  )

  const place = useCallback(
    (point, normal) => {
      const def = resolveItem(selectedItem)
      if (!def) return
      // keep items off the glass — clamp inside a safe circle
      const maxR = JAR.innerRadius * 0.88
      let x = point.x
      let z = point.z
      const r = Math.hypot(x, z)
      if (r > maxR) {
        x = (x / r) * maxR
        z = (z / r) * maxR
      }
      // organic variation so nothing looks grid-aligned or robotic
      const base = def.baseScale || 1
      const isBig = def.kind === 'stone'
      const scale = base * (isBig ? 0.7 + Math.random() * 0.5 : 0.82 + Math.random() * 0.32)
      const rotationY = Math.random() * Math.PI * 2
      // lean slightly with the surface normal + a touch of randomness
      const nx = normal ? normal.x : 0
      const nz = normal ? normal.z : 0
      const tiltX = -nz * 0.4 + (Math.random() - 0.5) * 0.14
      const tiltZ = nx * 0.4 + (Math.random() - 0.5) * 0.14

      addDecoration({
        itemId: def.id,
        kind: def.kind,
        variant: def.variant,
        url: def.url,
        position: [x, point.y - 0.01, z],
        rotationY,
        tiltX,
        tiltZ,
        scale,
        seed: Math.random(),
      })
    },
    [resolveItem, selectedItem, addDecoration]
  )

  const topIndex = layers.length - 1

  return (
    <>
      <color attach="background" args={['#20191420']} />
      <fog attach="fog" args={['#1c1611', 9, 22]} />

      {/* Key / fill / rim lighting for warm, premium look */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 30]} />
      </directionalLight>
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#ffd9a8" />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#fff2dc" />

      {/* Studio environment — drives glass reflections/refraction. No network HDRI. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#2a2018']} />
        <Lightformer intensity={3} position={[0, 5, -2]} scale={[8, 4, 1]} color="#fff4e2" />
        <Lightformer intensity={2} position={[-4, 2, 2]} scale={[3, 6, 1]} color="#ffe9cf" />
        <Lightformer intensity={2} position={[4, 2, 2]} scale={[3, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[0, -3, 2]} scale={[8, 3, 1]} color="#d9c6a5" />
      </Environment>

      {/* Table surface + soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]} receiveShadow>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#3a2c22" roughness={0.9} metalness={0} />
      </mesh>
      <ContactShadows
        position={[0, -1.79, 0]}
        opacity={0.55}
        scale={9}
        blur={2.6}
        far={4}
        resolution={1024}
        color="#140d08"
      />

      {/* Soil layers */}
      {layers.map((layer, i) => (
        <SubstrateLayer
          key={layer.id}
          layer={layer}
          isTop={i === topIndex}
          mode={mode}
          onPlace={place}
        />
      ))}

      <Decorations />

      {/* Glass jar drawn last for correct transmission over contents */}
      <Jar />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3.2}
        maxDistance={11}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 + 0.15}
        target={[0, -0.2, 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}
