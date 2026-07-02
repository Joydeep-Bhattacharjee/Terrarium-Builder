import { create } from 'zustand'
import { JAR, SUBSTRATES, DECORATIONS } from '../data/inventory.js'

let idCounter = 0
const uid = () => `${Date.now().toString(36)}-${(idCounter++).toString(36)}`

// Load admin custom items from localStorage
const loadCustom = () => {
  try {
    return JSON.parse(localStorage.getItem('terrarium.customItems') || '[]')
  } catch {
    return []
  }
}
const saveCustom = (items) =>
  localStorage.setItem('terrarium.customItems', JSON.stringify(items))

export const useStore = create((set, get) => ({
  mode: 'build', // 'build' | 'decorate'
  layers: [], // stacked substrate layers
  decorations: [], // placed items
  selectedMaterial: SUBSTRATES[0].id,
  selectedItem: DECORATIONS[0].id,
  customItems: loadCustom(),
  adminOpen: false,
  hoverEnabled: true,

  // drag-and-drop from the panel into the 3D jar
  dragItemId: null,
  dropRequest: null, // { ndc: [x, y], itemId }

  setMode: (mode) => set({ mode }),
  selectMaterial: (id) => set({ selectedMaterial: id, mode: 'build' }),
  selectItem: (id) => set({ selectedItem: id, mode: 'decorate' }),
  toggleAdmin: () => set((s) => ({ adminOpen: !s.adminOpen })),

  startDrag: (id) => set({ dragItemId: id, mode: 'decorate', selectedItem: id }),
  endDrag: () => set({ dragItemId: null }),
  requestDrop: (ndc, itemId) => set({ dropRequest: { ndc, itemId } }),
  clearDrop: () => set({ dropRequest: null }),

  // Total soil height currently filled (sum of layer thicknesses).
  filledHeight: () => get().layers.reduce((h, l) => h + l.thickness, 0),

  // Top Y surface of the soil (average level).
  surfaceY: () => JAR.floorY + get().layers.reduce((h, l) => h + l.thickness, 0),

  addLayer: (materialId) => {
    const mat = SUBSTRATES.find((m) => m.id === materialId)
    if (!mat) return
    // stop when nearly full
    if (get().filledHeight() > JAR.height * 0.62) return
    const baseY = JAR.floorY + get().filledHeight()
    set((s) => ({
      layers: [
        ...s.layers,
        {
          id: uid(),
          materialId: mat.id,
          color: mat.color,
          roughness: mat.roughness,
          grain: mat.grain,
          thickness: mat.thickness,
          baseY,
          seed: Math.random() * 1000,
        },
      ],
    }))
  },

  undoLayer: () =>
    set((s) => ({ layers: s.layers.slice(0, -1) })),

  clearLayers: () => set({ layers: [], decorations: [] }),

  addDecoration: (deco) =>
    set((s) => ({ decorations: [...s.decorations, { id: uid(), ...deco }] })),

  removeDecoration: (id) =>
    set((s) => ({ decorations: s.decorations.filter((d) => d.id !== id) })),

  undoDecoration: () =>
    set((s) => ({ decorations: s.decorations.slice(0, -1) })),

  clearDecorations: () => set({ decorations: [] }),

  addCustomItem: (item) =>
    set((s) => {
      const next = [...s.customItems, { id: `custom-${uid()}`, kind: 'glb', ...item }]
      saveCustom(next)
      return { customItems: next }
    }),

  removeCustomItem: (id) =>
    set((s) => {
      const next = s.customItems.filter((i) => i.id !== id)
      saveCustom(next)
      return { customItems: next }
    }),
}))

// Dev-only hook so automated QA can drive the store from the page console.
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  window.__ecobloom = useStore
}
