// Jar geometry constants (world units). Shared by scene + layer stacking.
export const JAR = {
  innerRadius: 1.15, // usable radius for soil/decor
  floorY: -1.55, // inner floor height where first layer sits
  wallThickness: 0.07,
  outerRadius: 1.28,
  height: 3.2,
}

// Substrate (base) materials. thickness = average layer height.
export const SUBSTRATES = [
  {
    id: 'brown-soil',
    name: 'Brown Soil',
    swatch: '#5a3e2b',
    color: '#4a3221',
    roughness: 0.95,
    grain: 0.05, // top surface bumpiness
    thickness: 0.16,
  },
  {
    id: 'sand',
    name: 'Sand',
    swatch: '#cbb08a',
    color: '#c2a878',
    roughness: 0.85,
    grain: 0.03,
    thickness: 0.13,
  },
  {
    id: 'white-sand',
    name: 'White Sand',
    swatch: '#e9e2d2',
    color: '#e2dac8',
    roughness: 0.8,
    grain: 0.025,
    thickness: 0.12,
  },
  {
    id: 'gravel',
    name: 'Gravel',
    swatch: '#7d7468',
    color: '#6e655a',
    roughness: 1.0,
    grain: 0.09,
    thickness: 0.18,
  },
  {
    id: 'activated-charcoal',
    name: 'Charcoal',
    swatch: '#2b2b2e',
    color: '#232326',
    roughness: 0.9,
    grain: 0.07,
    thickness: 0.1,
  },
]

// Decoration items. `kind` maps to a procedural model component.
// Custom admin items use kind:'glb' with a `url`.
export const DECORATIONS = [
  { id: 'cushion-moss', name: 'Cushion Moss', kind: 'moss', icon: '🌿', baseScale: 1.0 },
  { id: 'fittonia-pink', name: 'Fittonia Pink', kind: 'fittonia', variant: 'pink', icon: '🌸', baseScale: 1.0 },
  { id: 'fittonia-green', name: 'Fittonia Green', kind: 'fittonia', variant: 'green', icon: '☘️', baseScale: 1.0 },
  { id: 'small-fern', name: 'Small Fern', kind: 'fern', icon: '🌾', baseScale: 1.0 },
  { id: 'mushroom', name: 'Mini Mushroom', kind: 'mushroom', icon: '🍄', baseScale: 1.0 },
  { id: 'dragon-stone', name: 'Dragon Stone', kind: 'stone', icon: '🪨', baseScale: 1.0 },
  { id: 'sea-shell', name: 'Sea Shell', kind: 'shell', icon: '🐚', baseScale: 1.0 },
]
