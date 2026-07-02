import { useStore } from '../store/useStore.js'
import { SUBSTRATES, DECORATIONS } from '../data/inventory.js'

function SectionTitle({ children }) {
  return (
    <h3 className="px-1 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-mute">
      {children}
    </h3>
  )
}

export default function Sidebar() {
  const mode = useStore((s) => s.mode)
  const setMode = useStore((s) => s.setMode)
  const selectedMaterial = useStore((s) => s.selectedMaterial)
  const selectedItem = useStore((s) => s.selectedItem)
  const selectMaterial = useStore((s) => s.selectMaterial)
  const selectItem = useStore((s) => s.selectItem)
  const addLayer = useStore((s) => s.addLayer)
  const undoLayer = useStore((s) => s.undoLayer)
  const undoDecoration = useStore((s) => s.undoDecoration)
  const clearLayers = useStore((s) => s.clearLayers)
  const layers = useStore((s) => s.layers)
  const decorations = useStore((s) => s.decorations)
  const customItems = useStore((s) => s.customItems)
  const toggleAdmin = useStore((s) => s.toggleAdmin)
  const startDrag = useStore((s) => s.startDrag)
  const endDrag = useStore((s) => s.endDrag)

  const allDecor = [...DECORATIONS, ...customItems]

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-line bg-panel/90 text-ink backdrop-blur-xl">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-moss-400 to-moss-600 text-lg shadow-sm">
          🌿
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight text-ink">
            EcoBloom <span className="text-moss-600">Terra-Space</span>
          </div>
          <div className="text-[11px] text-ink-mute">Build it layer by layer</div>
        </div>
      </div>

      {/* mode switch */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-sand-100 p-1 ring-1 ring-line">
          {[
            ['build', 'Build Base'],
            ['decorate', 'Decorate'],
          ].map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                mode === m
                  ? 'bg-panel text-ink shadow-sm ring-1 ring-line'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-slim flex-1 overflow-y-auto px-3 pb-3">
        {mode === 'build' ? (
          <>
            <SectionTitle>Substrate Layers</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {SUBSTRATES.map((m) => {
                const active = selectedMaterial === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      selectMaterial(m.id)
                      addLayer(m.id)
                    }}
                    className={`group flex flex-col items-start gap-2 rounded-xl border p-2.5 text-left transition ${
                      active
                        ? 'border-moss-400 bg-sand-100 shadow-sm'
                        : 'border-line bg-paper-2 hover:border-line-2 hover:shadow-sm'
                    }`}
                  >
                    <span
                      className="h-9 w-full rounded-lg ring-1 ring-black/10"
                      style={{ background: m.swatch }}
                    />
                    <span className="text-xs font-medium text-ink">{m.name}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 px-1 text-[11px] leading-relaxed text-ink-soft">
              Tap a material to drop a fresh layer into the jar. Each one stacks
              with its own uneven surface — like filling a real jar.
            </p>
          </>
        ) : (
          <>
            <SectionTitle>Plants & Objects</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {allDecor.map((d) => {
                const active = selectedItem === d.id
                return (
                  <button
                    key={d.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', d.id)
                      e.dataTransfer.effectAllowed = 'copy'
                      startDrag(d.id)
                    }}
                    onDragEnd={endDrag}
                    onClick={() => selectItem(d.id)}
                    className={`flex cursor-grab flex-col items-center gap-1.5 rounded-xl border p-3 transition active:cursor-grabbing ${
                      active
                        ? 'border-moss-400 bg-sand-100 shadow-sm'
                        : 'border-line bg-paper-2 hover:border-line-2 hover:shadow-sm'
                    }`}
                  >
                    <span className="pointer-events-none text-2xl leading-none">
                      {d.icon || '🪴'}
                    </span>
                    <span className="pointer-events-none text-center text-[11px] font-medium text-ink">
                      {d.name}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 px-1 text-[11px] leading-relaxed text-ink-soft">
              Pick an item, then click the soil surface inside the jar to place
              it. Alt-click a placed item to remove it.
            </p>
            {layers.length === 0 && (
              <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                Add a soil base first — switch to <b>Build Base</b>.
              </p>
            )}
          </>
        )}
      </div>

      {/* footer actions */}
      <div className="border-t border-line p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-ink-mute">
          <span>{layers.length} layers</span>
          <span>{decorations.length} items</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={mode === 'build' ? undoLayer : undoDecoration}
            className="rounded-lg border border-line bg-paper-2 px-2 py-2 text-[11px] font-medium text-ink-soft hover:bg-sand-100"
          >
            Undo
          </button>
          <button
            onClick={clearLayers}
            className="rounded-lg border border-line bg-paper-2 px-2 py-2 text-[11px] font-medium text-ink-soft hover:bg-sand-100"
          >
            Reset
          </button>
          <button
            onClick={toggleAdmin}
            className="rounded-lg bg-moss-600 px-2 py-2 text-[11px] font-medium text-white hover:bg-moss-700"
          >
            Admin
          </button>
        </div>
      </div>
    </aside>
  )
}
