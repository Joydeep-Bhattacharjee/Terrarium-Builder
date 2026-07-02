import { Suspense } from 'react'
import Moss from './Moss.jsx'
import Fittonia from './Fittonia.jsx'
import Fern from './Fern.jsx'
import Mushroom from './Mushroom.jsx'
import DragonStone from './DragonStone.jsx'
import SeaShell from './SeaShell.jsx'
import GlbModel from './GlbModel.jsx'

// Renders the right procedural model (or a custom GLB) for a decoration kind.
export default function ModelDispatch({ kind, variant, url, seed }) {
  switch (kind) {
    case 'moss':
      return <Moss seed={seed} />
    case 'fittonia':
      return <Fittonia seed={seed} variant={variant} />
    case 'fern':
      return <Fern seed={seed} />
    case 'mushroom':
      return <Mushroom seed={seed} />
    case 'stone':
      return <DragonStone seed={seed} />
    case 'shell':
      return <SeaShell seed={seed} />
    case 'glb':
      return (
        <Suspense fallback={null}>
          <GlbModel url={url} />
        </Suspense>
      )
    default:
      return null
  }
}
