import fs from "node:fs/promises";
import path from "node:path";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

class FileReaderPolyfill {
  constructor() {
    this.result = null;
    this.onloadend = null;
    this.onerror = null;
  }

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer();
      if (this.onloadend) this.onloadend();
    } catch (error) {
      if (this.onerror) this.onerror(error);
    }
  }

  async readAsDataURL(blob) {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
      if (this.onloadend) this.onloadend();
    } catch (error) {
      if (this.onerror) this.onerror(error);
    }
  }
}

if (!globalThis.FileReader) {
  globalThis.FileReader = FileReaderPolyfill;
}

const WORKDIR = process.cwd();
const INPUT_OBJ = path.join(WORKDIR, "public/models/red-maple/red-maple.obj");
const OUTPUT_DIR = path.join(WORKDIR, "public/assets/trees");
const TREE_NAME = "red_maple";
const HERO_OUT = path.join(OUTPUT_DIR, `${TREE_NAME}_hero.glb`);
const LOD1_OUT = path.join(OUTPUT_DIR, `${TREE_NAME}_lod1.glb`);
const README_OUT = path.join(OUTPUT_DIR, "README.md");

const SPECIES = "red maple";
const SEASON = "summer";
const STYLE = "slightly stylized photoreal";
const HERO_BUDGET = 40000;
const LOD1_BUDGET = 10000;
const TEXTURE_BUDGET = "2K max suggested (not embedded in this pass)";
const WIND = "Yes (runtime shader/vertex sway recommended)";

function toNonIndexed(geometry) {
  const g = geometry.clone();
  return g.index ? g.toNonIndexed() : g;
}

function getTriangleCount(geometry) {
  const vertexCount = geometry.getAttribute("position").count;
  return Math.floor(vertexCount / 3);
}

function prepareGeometry(geometry) {
  const g = toNonIndexed(geometry);
  g.computeVertexNormals();
  return g;
}

function classifyMesh(mesh) {
  const haystack = `${mesh.name} ${mesh.material?.name || ""}`.toLowerCase();
  if (haystack.includes("foliage") || haystack.includes("leaf")) return "foliage";
  return "trunk";
}

function centerAndScaleToHeight(group, targetHeight = 6) {
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  const height = size.y || 1;
  const scale = targetHeight / height;
  group.scale.setScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(group);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  group.position.x -= center.x;
  group.position.z -= center.z;
  const floorY = scaledBox.min.y;
  group.position.y -= floorY;
}

function simplifyGeometry(geometry, ratio) {
  const modifier = new SimplifyModifier();
  const g = toNonIndexed(geometry);
  const vertexCount = g.getAttribute("position").count;
  const targetVertexCount = Math.max(3, Math.floor(vertexCount * ratio));
  const verticesToRemove = Math.max(0, vertexCount - targetVertexCount);
  if (verticesToRemove === 0) return g;
  return modifier.modify(g, verticesToRemove);
}

function simplifyGeometryToTriangles(geometry, targetTriangles) {
  const currentTriangles = getTriangleCount(geometry);
  if (targetTriangles >= currentTriangles) return geometry.clone();
  const ratio = Math.max(0.02, targetTriangles / currentTriangles);
  return simplifyGeometry(geometry, ratio);
}

async function exportGLB(scene) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(result),
      (error) => reject(error),
      { binary: true, includeCustomExtensions: false }
    );
  });
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const objText = await fs.readFile(INPUT_OBJ, "utf8");
  const object = new OBJLoader().parse(objText);

  const trunkGeometries = [];
  const foliageGeometries = [];

  object.traverse((node) => {
    if (!node.isMesh || !node.geometry) return;
    const prepared = prepareGeometry(node.geometry);
    if (classifyMesh(node) === "foliage") foliageGeometries.push(prepared);
    else trunkGeometries.push(prepared);
  });

  if (trunkGeometries.length === 0 || foliageGeometries.length === 0) {
    throw new Error("Could not identify both trunk and foliage meshes from OBJ.");
  }

  const trunkMerged = BufferGeometryUtils.mergeGeometries(trunkGeometries, false);
  const foliageMerged = BufferGeometryUtils.mergeGeometries(foliageGeometries, false);

  trunkMerged.computeVertexNormals();
  foliageMerged.computeVertexNormals();

  const trunkMaterial = new THREE.MeshStandardMaterial({
    name: "tree_trunk_mat",
    color: new THREE.Color("#6a4a34"),
    roughness: 0.9,
    metalness: 0.03
  });

  const foliageMaterial = new THREE.MeshStandardMaterial({
    name: "tree_foliage_mat",
    color: new THREE.Color("#4d8a43"),
    roughness: 0.8,
    metalness: 0.0
  });

  const trunkTrisOriginal = getTriangleCount(trunkMerged);
  const foliageTrisOriginal = getTriangleCount(foliageMerged);
  const totalOriginal = trunkTrisOriginal + foliageTrisOriginal;
  const trunkRatio = trunkTrisOriginal / totalOriginal;
  const foliageRatio = foliageTrisOriginal / totalOriginal;

  const heroTrunk = simplifyGeometryToTriangles(
    trunkMerged,
    Math.floor(HERO_BUDGET * trunkRatio)
  );
  const heroFoliage = simplifyGeometryToTriangles(
    foliageMerged,
    Math.floor(HERO_BUDGET * foliageRatio)
  );
  heroTrunk.computeVertexNormals();
  heroFoliage.computeVertexNormals();

  const heroGroup = new THREE.Group();
  heroGroup.name = `${TREE_NAME}_hero`;
  const heroTrunkMesh = new THREE.Mesh(heroTrunk, trunkMaterial);
  heroTrunkMesh.name = "trunk";
  const heroFoliageMesh = new THREE.Mesh(heroFoliage, foliageMaterial);
  heroFoliageMesh.name = "foliage";
  heroGroup.add(heroTrunkMesh, heroFoliageMesh);
  centerAndScaleToHeight(heroGroup, 6);

  const heroScene = new THREE.Scene();
  heroScene.name = "tree_asset_scene";
  heroScene.add(heroGroup);
  const heroGlb = await exportGLB(heroScene);
  await fs.writeFile(HERO_OUT, Buffer.from(heroGlb));

  const heroTrisActual = getTriangleCount(heroTrunk) + getTriangleCount(heroFoliage);
  const lodTrunk = simplifyGeometryToTriangles(
    heroTrunk,
    Math.floor(LOD1_BUDGET * trunkRatio)
  );
  const lodFoliage = simplifyGeometryToTriangles(
    heroFoliage,
    Math.floor(LOD1_BUDGET * foliageRatio)
  );
  lodTrunk.computeVertexNormals();
  lodFoliage.computeVertexNormals();

  const lodGroup = new THREE.Group();
  lodGroup.name = `${TREE_NAME}_lod1`;
  const lodTrunkMesh = new THREE.Mesh(lodTrunk, trunkMaterial.clone());
  lodTrunkMesh.name = "trunk";
  const lodFoliageMesh = new THREE.Mesh(lodFoliage, foliageMaterial.clone());
  lodFoliageMesh.name = "foliage";
  lodGroup.add(lodTrunkMesh, lodFoliageMesh);
  centerAndScaleToHeight(lodGroup, 6);

  const lodScene = new THREE.Scene();
  lodScene.name = "tree_asset_scene_lod1";
  lodScene.add(lodGroup);
  const lodGlb = await exportGLB(lodScene);
  await fs.writeFile(LOD1_OUT, Buffer.from(lodGlb));

  const heroTris = heroTrisActual;
  const lodTris = getTriangleCount(lodTrunk) + getTriangleCount(lodFoliage);
  const heroStats = await fs.stat(HERO_OUT);
  const lodStats = await fs.stat(LOD1_OUT);

  const readme = `# Tree Assets

## Asset Set
- Tree name: \`${TREE_NAME}\`
- Species: ${SPECIES}
- Season: ${SEASON}
- Style: ${STYLE}
- Wind animation needed: ${WIND}

## Files
- \`/public/assets/trees/${TREE_NAME}_hero.glb\`
- \`/public/assets/trees/${TREE_NAME}_lod1.glb\`

## Budgets And Results
- Target poly budget: ~${HERO_BUDGET.toLocaleString()} triangles (hero), ~${LOD1_BUDGET.toLocaleString()} triangles (LOD1)
- Actual poly count: ${heroTris.toLocaleString()} triangles (hero), ${lodTris.toLocaleString()} triangles (LOD1)
- Texture budget: ${TEXTURE_BUDGET}
- File sizes: ${(heroStats.size / 1024 / 1024).toFixed(2)} MB (hero), ${(lodStats.size / 1024 / 1024).toFixed(2)} MB (LOD1)

## Material Notes
- PBR materials used (\`MeshStandardMaterial\`).
- Trunk and foliage are merged into two meshes for low draw-call overhead.
- Default colors are embedded to avoid missing texture issues.

## Three.js Import Notes
\`\`\`js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const hero = await loader.loadAsync("/assets/trees/${TREE_NAME}_hero.glb");
const lod1 = await loader.loadAsync("/assets/trees/${TREE_NAME}_lod1.glb");

const tree = hero.scene;
tree.position.set(0, 0, 0);
tree.scale.setScalar(1.0);
scene.add(tree);
\`\`\`

## Lighting Notes
- Good neutral baseline:
  - \`HemisphereLight(0xffffff, 0x5b6b79, 0.6)\`
  - \`DirectionalLight(0xffffff, 1.0)\` from a 30-45 degree angle
  - Optional HDRI for specular richness.

## LOD Switching Strategy
- Use \`THREE.LOD\` with distance thresholds:
  - Hero (\`${TREE_NAME}_hero.glb\`): 0-18 units
  - LOD1 (\`${TREE_NAME}_lod1.glb\`): 18-60 units
- Add a billboard/impostor at farther distances for forests.

## Compression Recommendations
- Apply Draco or Meshopt in build pipeline for shipping:
  - Expect 30-70% smaller GLB payloads.
- Use KTX2/Basis textures if texture maps are introduced later.
`;

  await fs.writeFile(README_OUT, readme, "utf8");

  console.log(
    JSON.stringify(
      {
        hero: { tris: heroTris, bytes: heroStats.size, path: HERO_OUT },
        lod1: { tris: lodTris, bytes: lodStats.size, path: LOD1_OUT }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
