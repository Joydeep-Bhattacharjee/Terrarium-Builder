import { useStore } from '../store/useStore.js'
import ModelDispatch from '../models/ModelDispatch.jsx'

// Renders all placed decorations with their per-instance transform.
// Alt-click a decoration to remove it.
export default function Decorations() {
  const decorations = useStore((s) => s.decorations)
  const mode = useStore((s) => s.mode)
  const removeDecoration = useStore((s) => s.removeDecoration)

  return (
    <group>
      {decorations.map((d) => (
        <group
          key={d.id}
          position={d.position}
          rotation={[d.tiltX, d.rotationY, d.tiltZ]}
          scale={d.scale}
          onPointerDown={(e) => {
            if (mode === 'decorate' && e.altKey) {
              e.stopPropagation()
              removeDecoration(d.id)
            }
          }}
        >
          <ModelDispatch kind={d.kind} variant={d.variant} url={d.url} seed={d.seed} />
        </group>
      ))}
    </group>
  )
}
