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
      <div className="rounded-full border border-line bg-panel/80 px-4 py-2 text-xs text-ink-soft backdrop-blur">
        Preparing terrarium…
      </div>
    </div>
  )
}

export default function App() {
  const mode = useStore((s) => s.mode)
  const layers = useStore((s) => s.layers)
  const requestDrop = useStore((s) => s.requestDrop)
  const decorating = mode === 'decorate' && layers.length > 0

  const handleDrop = (e) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData('text/plain')
    if (!itemId) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1
    requestDrop([ndcX, ndcY], itemId)
  }

  return (
    <div className="relative flex h-full w-full bg-paper">
      {/* 3D viewport */}
      <div
        className="relative h-full flex-1"
        style={{ cursor: decorating ? 'crosshair' : 'grab' }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={handleDrop}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          camera={{ position: [3.9, 2.7, 4.7], fov: 42 }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* top-left brand + hint */}
        <div className="pointer-events-none absolute left-5 top-5 select-none">
          <h1 className="text-lg font-semibold tracking-tight text-ink">
            EcoBloom <span className="text-moss-600">Terra-Space</span>
          </h1>
          <p className="mt-0.5 text-xs text-ink-soft">
            Drag to orbit · {mode === 'build' ? 'stack soil layers' : 'drag or click an item onto the soil'}
          </p>
        </div>

        <Suspense fallback={<Loader />}>{/* GLB loading hint */}</Suspense>
      </div>

      <Sidebar />
      <AdminDashboard />
    </div>
  )
}
