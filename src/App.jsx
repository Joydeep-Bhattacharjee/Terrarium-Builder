import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import Scene from './components/Scene.jsx'
import Sidebar from './ui/Sidebar.jsx'
import AdminDashboard from './ui/AdminDashboard.jsx'
import { useStore } from './store/useStore.js'

function Loader() {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="rounded-full bg-black/40 px-4 py-2 text-xs text-clay-200 backdrop-blur">
        Preparing terrarium…
      </div>
    </div>
  )
}

export default function App() {
  const mode = useStore((s) => s.mode)
  const layers = useStore((s) => s.layers)
  const decorating = mode === 'decorate' && layers.length > 0

  return (
    <div className="relative flex h-full w-full bg-clay-900">
      {/* 3D viewport */}
      <div
        className="relative h-full flex-1"
        style={{ cursor: decorating ? 'crosshair' : 'grab' }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          camera={{ position: [4.5, 1.6, 5.5], fov: 42 }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* top-left brand + hint */}
        <div className="pointer-events-none absolute left-5 top-5 select-none">
          <h1 className="text-lg font-semibold tracking-tight text-clay-100 drop-shadow">
            Virtual Terrarium Builder
          </h1>
          <p className="mt-0.5 text-xs text-clay-300/80">
            Drag to orbit · {mode === 'build' ? 'stack soil layers' : 'click soil to plant'}
          </p>
        </div>

        <Suspense fallback={<Loader />}>{/* GLB loading hint */}</Suspense>
      </div>

      <Sidebar />
      <AdminDashboard />
    </div>
  )
}
