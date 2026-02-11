# Tree Assets

## Asset Set
- Tree name: `red_maple`
- Species: red maple
- Season: summer
- Style: slightly stylized photoreal
- Wind animation needed: Yes (runtime shader/vertex sway recommended)

## Files
- `/public/assets/trees/red_maple_hero.glb`
- `/public/assets/trees/red_maple_lod1.glb`

## Budgets And Results
- Target poly budget: ~40,000 triangles (hero), ~10,000 triangles (LOD1)
- Actual poly count: 30,993 triangles (hero), 9,261 triangles (LOD1)
- Texture budget: 2K max suggested (not embedded in this pass)
- File sizes: 3.19 MB (hero), 0.91 MB (LOD1)

## Material Notes
- PBR materials used (`MeshStandardMaterial`).
- Trunk and foliage are merged into two meshes for low draw-call overhead.
- Default colors are embedded to avoid missing texture issues.

## Three.js Import Notes
```js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const hero = await loader.loadAsync("/assets/trees/red_maple_hero.glb");
const lod1 = await loader.loadAsync("/assets/trees/red_maple_lod1.glb");

const tree = hero.scene;
tree.position.set(0, 0, 0);
tree.scale.setScalar(1.0);
scene.add(tree);
```

## Lighting Notes
- Good neutral baseline:
  - `HemisphereLight(0xffffff, 0x5b6b79, 0.6)`
  - `DirectionalLight(0xffffff, 1.0)` from a 30-45 degree angle
  - Optional HDRI for specular richness.

## LOD Switching Strategy
- Use `THREE.LOD` with distance thresholds:
  - Hero (`red_maple_hero.glb`): 0-18 units
  - LOD1 (`red_maple_lod1.glb`): 18-60 units
- Add a billboard/impostor at farther distances for forests.

## Compression Recommendations
- Apply Draco or Meshopt in build pipeline for shipping:
  - Expect 30-70% smaller GLB payloads.
- Use KTX2/Basis textures if texture maps are introduced later.
