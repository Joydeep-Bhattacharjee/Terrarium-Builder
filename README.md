# 🌿 Virtual Terrarium Builder

A photorealistic, interactive **3D terrarium builder** in the browser. Design a
terrarium inside a glass jar the way you would build a real one — stack soil
layers from the bottom up, then plant moss, ferns, fittonia, mushrooms, stones,
and shells on the uneven surface.

Built with **React + Vite + Three.js (React Three Fiber)** and **Tailwind CSS**.

---

## ✨ Features

- **Realistic glass jar** — real wall thickness (LatheGeometry) + PBR
  `MeshTransmissionMaterial` for true transparency, refraction, chromatic
  aberration, and reflections.
- **Orbit camera** — click-drag to rotate around the jar from any angle
  (OrbitControls), damped and clamped so the jar is never cut off.
- **Layer-by-layer base** — Brown Soil, Sand, White Sand, Gravel, Charcoal.
  Every tap drops a fresh thin layer that stacks from the bottom with its own
  **uneven, noise-displaced top surface**.
- **Natural decoration** — pick an item, click the soil top to place it. Items
  raycast the real bumpy surface, then get **random scale, rotation, and tilt**
  so nothing looks grid-aligned or robotic. Alt-click a placed item to remove it.
- **Procedural organic models** — moss, fittonia (pink/green), fern, mushroom,
  dragon stone, sea shell — all generated in code, no asset downloads.
- **Admin Dashboard** — toggle a hidden panel to register your own `.glb`
  models by Name, Icon, and URL. Saved to `localStorage`, instantly available
  in the Decorate palette, auto-scaled to sit on the soil.
- **Premium UI** — warm, earthy clay/moss palette; the 3D canvas fills the full
  screen height so the jar is never clipped.

---

## 🛠 Tech Stack

| Layer      | Tech                                              |
| ---------- | ------------------------------------------------- |
| Framework  | React 18 + Vite 5                                 |
| 3D         | Three.js, @react-three/fiber, @react-three/drei   |
| State      | Zustand                                           |
| Styling    | Tailwind CSS v4                                    |

---

## 🚀 Getting Started

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev
```

Then open the URL it prints (default **http://localhost:5173**).

> ⚠️ The page **only works while `npm run dev` is running**. If you see
> `ERR_CONNECTION_REFUSED`, the server is stopped — run `npm run dev` again.

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

---

## 🎮 How to Use

1. **Build the base.** In the **Build Base** tab, tap soil materials. Each tap
   adds a layer. Stack a few for depth.
2. **Decorate.** Switch to the **Decorate** tab, pick a plant/object, then
   **click the soil surface** inside the jar to place it. Click multiple times
   to scatter — each placement is randomized.
3. **Adjust.** Use **Undo** / **Reset** in the sidebar footer, or **Alt-click**
   a placed item in the scene to delete just that one.
4. **Add custom models.** Click **Admin** → enter a Name, Icon, and public
   `.glb` URL. It appears in the Decorate palette.

---

## 📁 Project Structure

```
src/
  data/inventory.js       # jar dimensions, substrate + decoration catalog
  store/useStore.js       # zustand global state (layers, decorations, admin)
  utils/noise.js          # value noise / fBm / seeded PRNG (no deps)
  components/
    Scene.jsx             # lights, environment, placement logic, assembly
    Jar.jsx               # glass jar geometry + transmission material
    SubstrateLayer.jsx    # one stacked soil layer + uneven top surface
    Decorations.jsx       # renders all placed items
  models/                 # procedural plants/objects + GLB loader
    Moss / Fittonia / Fern / Mushroom / DragonStone / SeaShell
    GlbModel.jsx          # loads + normalizes custom .glb
    ModelDispatch.jsx     # maps a kind → model component
  ui/
    Sidebar.jsx           # inventory, mode switch, actions
    AdminDashboard.jsx    # custom .glb registration
  App.jsx                 # layout: canvas + sidebar
```

---

## 🧩 Adding a Custom `.glb`

The model URL must be **publicly reachable and CORS-enabled** (e.g. a raw
GitHub URL, a CDN, or your own hosting). The loader auto-centers the model,
scales it to ~0.55 units, and rests its base on the soil.

---

## 📝 Notes

- Built-in plants are procedural — organic, but not photoreal. For full
  photorealism, drop real `.glb` plant assets via the Admin panel.
- Reflections use an in-scene studio environment (drei `Lightformer`s), so the
  app needs **no network HDRI** and works offline.
- `npm audit` reports transitive warnings from `three-mesh-bvh` (a drei
  dependency) — dev-only, not runtime-blocking.
