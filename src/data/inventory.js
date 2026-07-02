// Jar geometry constants (world units). Rounded fishbowl. Shared by scene +
// layer stacking + placement.
export const JAR = {
  innerRadius: 1.14, // usable radius for soil/decor in the lower bowl
  floorY: -1.3, // inner floor height where first layer sits
  wallThickness: 0.08,
  bellyRadius: 1.5, // widest inner radius
  height: 2.5, // interior height (floor -> rim)
  fillMax: 1.05, // stop stacking soil past this height
}

// Substrate (base) materials, ordered like a real terrarium build:
// charcoal -> drainage gravel -> potting soil -> sand -> pebble top dressing.
// thickness = average layer height.
export const SUBSTRATES = [
  {
    id: 'activated-charcoal',
    name: 'Activated Charcoal',
    swatch: '#2b2b2e',
    color: '#232326',
    roughness: 0.9,
    grain: 0.07,
    thickness: 0.11,
  },
  {
    id: 'pea-gravel',
    name: 'Pea Gravel',
    swatch: '#8f877b',
    color: '#837a6d',
    roughness: 1.0,
    grain: 0.1,
    thickness: 0.18,
  },
  {
    id: 'brown-soil',
    name: 'Potting Soil',
    swatch: '#4a3324',
    color: '#3d2a1c',
    roughness: 0.97,
    grain: 0.06,
    thickness: 0.2,
  },
  {
    id: 'sand',
    name: 'Sand',
    swatch: '#cbb08a',
    color: '#c2a878',
    roughness: 0.85,
    grain: 0.035,
    thickness: 0.13,
  },
  {
    id: 'white-pebbles',
    name: 'White Pebbles',
    swatch: '#eae6dc',
    color: '#e6e1d4',
    roughness: 0.7,
    grain: 0.09,
    thickness: 0.12,
  },
]

// Decoration items. `kind` maps to a procedural model component.
// Custom admin items use kind:'glb' with a `url`.
export const DECORATIONS = [
  { id: 'echeveria-green', name: 'Echeveria', kind: 'echeveria', variant: 'green', icon: '🪷', baseScale: 1.4 },
  { id: 'echeveria-red', name: 'Red Echeveria', kind: 'echeveria', variant: 'red', icon: '🌺', baseScale: 1.4 },
  { id: 'cactus', name: 'Cactus', kind: 'cactus', icon: '🌵', baseScale: 1.35 },
  { id: 'haworthia', name: 'Haworthia', kind: 'haworthia', icon: '🌱', baseScale: 1.3 },
  { id: 'cushion-moss', name: 'Cushion Moss', kind: 'moss', icon: '🌿', baseScale: 1.2 },
  { id: 'fittonia-pink', name: 'Fittonia Pink', kind: 'fittonia', variant: 'pink', icon: '🌸', baseScale: 1.25 },
  { id: 'small-fern', name: 'Small Fern', kind: 'fern', icon: '🌾', baseScale: 1.25 },
  { id: 'dragon-stone', name: 'Dragon Stone', kind: 'stone', icon: '🪨', baseScale: 1.0 },
  { id: 'sea-shell', name: 'Sea Shell', kind: 'shell', icon: '🐚', baseScale: 1.0 },
]
