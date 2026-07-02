# 📋 Product Requirements Document — Virtual Terrarium Builder

**Version:** 1.0
**Status:** Implemented (v0.1.0)
**Owner:** Sourov

---

## 1. Overview

A web app that lets users design a realistic terrarium inside a 3D glass jar,
built layer by layer exactly like a real one — first the soil base, then plants
and objects on top. The experience must feel **premium, photorealistic, and
natural**, never low-poly or cartoonish.

### Goals
- Let anyone build a believable terrarium in the browser with no 3D skill.
- Look and feel like a real jar: glass, soil, organic plants.
- Be extensible — the owner can add new 3D models over time without a rebuild.

### Non-Goals (v1)
- Saving/sharing terrarium designs to a backend.
- Multiplayer or accounts.
- Physics simulation (growth, water, lighting cycles).

---

## 2. User Roles

| Role  | Capability                                                        |
| ----- | ----------------------------------------------------------------- |
| User  | Build layers, place decorations, orbit the camera.                |
| Admin | Everything a User can, plus register custom `.glb` models.        |

---

## 3. Functional Requirements (build order)

Steps are ordered the way the app was built and the way a user experiences it.

### Step 1 — The 3D Scene
- **R1.1** A realistic glass jar sits centered on screen. ✅
- **R1.2** Glass has transparency, refraction, and reflections (PBR). ✅
- **R1.3** Click-drag orbits the camera around the jar (OrbitControls). ✅
- **R1.4** Camera is clamped so the jar is never cut off or flipped. ✅
- **R1.5** Warm, premium lighting + studio reflections (works offline). ✅

### Step 2 — Building the Base (Substrate Layers)
- **R2.1** Palette of base materials: Brown Soil, Sand, White Sand, Gravel,
  Charcoal. ✅
- **R2.2** Tapping a material adds one thin layer inside the jar. ✅
- **R2.3** Layers stack from the bottom up, like filling a real jar. ✅
- **R2.4** Each layer has an **uneven, natural top surface** (noise-displaced),
  not a flat disc. ✅
- **R2.5** Filling stops when the jar is ~62% full (leaves room to plant). ✅
- **R2.6** Undo last layer / Reset all. ✅

### Step 3 — Decorating the Top
- **R3.1** A **Decorate** mode, switched from a Build mode. ✅
- **R3.2** Organic items: Cushion Moss, Fittonia (Pink/Green), Small Fern,
  Mini Mushroom, Dragon Stone, Sea Shell. ✅
- **R3.3** Select an item, then **click the soil top** to place it there. ✅
- **R3.4** Items sit on the **real uneven surface** at the clicked point
  (raycast against the displaced mesh). ✅
- **R3.5** Each placement gets **random scale, rotation, and tilt** so results
  never look grid-aligned or robotic. ✅
- **R3.6** Items are clamped inside a safe radius so they never poke through the
  glass. ✅
- **R3.7** Alt-click a placed item to remove it; Undo removes the last. ✅

### Step 4 — UI / UX
- **R4.1** Clean modern **side panel** with the inventory (materials + plants). ✅
- **R4.2** The 3D canvas fills the remaining full screen height. ✅
- **R4.3** Warm, earthy color palette; premium, aesthetic feel. ✅
- **R4.4** Live counts (layers, items) and clear mode switch. ✅
- **R4.5** Helpful hints (e.g. "add a soil base first"). ✅

### Step 5 — Admin Dashboard
- **R5.1** Hidden/toggleable admin panel. ✅
- **R5.2** Add a custom model via **Name, Icon, and `.glb` URL**. ✅
- **R5.3** Validates the URL points to a `.glb`. ✅
- **R5.4** Custom models persist (`localStorage`) and appear in the Decorate
  palette immediately. ✅
- **R5.5** Custom `.glb` is auto-centered, scaled, and rested on the soil. ✅

---

## 4. Non-Functional Requirements

- **NFR-1 Realism:** PBR materials only; no flat-shaded cartoon look for the
  jar or surfaces.
- **NFR-2 Performance:** Interactive frame rate on a mid-range laptop; instanced
  geometry for dense elements (moss); capped transmission samples/resolution.
- **NFR-3 Offline:** No runtime dependency on external HDRI/CDN for the scene to
  render (custom `.glb` URLs are the only network need, and are opt-in).
- **NFR-4 Extensibility:** New decoration types are data-driven (catalog entry +
  a model component or a `.glb`).
- **NFR-5 Responsiveness:** Layout targets desktop first (side panel + full-height
  canvas).

---

## 5. Tech Stack

- React 18 + Vite 5
- Three.js + @react-three/fiber + @react-three/drei
- Zustand (state)
- Tailwind CSS v4

---

## 6. Data Model (core state)

```
mode:          'build' | 'decorate'
layers:        [{ id, materialId, color, roughness, grain, thickness, baseY, seed }]
decorations:   [{ id, itemId, kind, variant?, url?, position[3],
                  rotationY, tiltX, tiltZ, scale, seed }]
customItems:   [{ id, kind:'glb', name, icon, url }]   // persisted
```

---

## 7. Acceptance Criteria

- [x] Jar renders with visible refraction and reflections.
- [x] Camera orbits smoothly; jar never clipped.
- [x] Each material tap adds a visibly uneven stacked layer.
- [x] Placing the same item repeatedly yields varied scale/rotation.
- [x] Items never intersect the glass wall.
- [x] Admin can add a `.glb` that then appears and places correctly.
- [x] App builds (`npm run build`) with no errors.

---

## 8. Future Enhancements (backlog)

- Preset library of free `.glb` plant assets (one-click, no admin).
- Save / load / share a finished terrarium (JSON export or backend).
- Drag-to-reposition and rotate placed items.
- Mobile / touch layout (bottom sheet inventory).
- Water droplets, condensation on glass, day/night lighting.
- Screenshot / export-to-image button.
```
