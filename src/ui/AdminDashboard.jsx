import { useState } from 'react'
import { useStore } from '../store/useStore.js'

// Toggleable admin panel to register custom .glb decoration models.
export default function AdminDashboard() {
  const open = useStore((s) => s.adminOpen)
  const toggle = useStore((s) => s.toggleAdmin)
  const customItems = useStore((s) => s.customItems)
  const addCustomItem = useStore((s) => s.addCustomItem)
  const removeCustomItem = useStore((s) => s.removeCustomItem)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🪴')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) {
      setError('Name and .glb URL are required.')
      return
    }
    if (!/\.glb($|\?)/i.test(url.trim())) {
      setError('URL should point to a .glb file.')
      return
    }
    addCustomItem({ name: name.trim(), icon: icon.trim() || '🪴', url: url.trim() })
    setName('')
    setUrl('')
    setIcon('🪴')
    setError('')
  }

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-clay-700 bg-clay-900 text-clay-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-clay-800 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Admin Dashboard</h2>
            <p className="text-[11px] text-clay-400">Add custom 3D models (.glb)</p>
          </div>
          <button
            onClick={toggle}
            className="rounded-lg px-3 py-1.5 text-xs text-clay-300 hover:bg-clay-800 hover:text-clay-100"
          >
            Close ✕
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-3 px-5 py-4">
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <label className="grid gap-1 text-[11px] text-clay-400">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bonsai Tree"
                className="rounded-lg border border-clay-700 bg-clay-800 px-3 py-2 text-sm text-clay-100 outline-none focus:border-moss-400"
              />
            </label>
            <label className="grid gap-1 text-[11px] text-clay-400">
              Icon
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={2}
                className="rounded-lg border border-clay-700 bg-clay-800 px-3 py-2 text-center text-lg text-clay-100 outline-none focus:border-moss-400"
              />
            </label>
          </div>
          <label className="grid gap-1 text-[11px] text-clay-400">
            .glb URL
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…/model.glb"
              className="rounded-lg border border-clay-700 bg-clay-800 px-3 py-2 text-sm text-clay-100 outline-none focus:border-moss-400"
            />
          </label>
          {error && <p className="text-[11px] text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-1 rounded-lg bg-moss-600 px-4 py-2 text-sm font-medium text-white hover:bg-moss-500"
          >
            Add Model
          </button>
        </form>

        {customItems.length > 0 && (
          <div className="border-t border-clay-800 px-5 py-4">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-clay-400">
              Custom Models
            </h3>
            <ul className="grid gap-2">
              {customItems.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-lg border border-clay-800 bg-clay-800/50 px-3 py-2"
                >
                  <span className="text-xl">{it.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{it.name}</div>
                    <div className="truncate text-[11px] text-clay-500">{it.url}</div>
                  </div>
                  <button
                    onClick={() => removeCustomItem(it.id)}
                    className="rounded px-2 py-1 text-[11px] text-red-300 hover:bg-clay-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
