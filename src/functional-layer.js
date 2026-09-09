import * as T from 'three';
import { FUNCTIONAL_AREAS } from './functional.js';

export async function createFunctionalLayer() {
  const base = `${import.meta.env.BASE_URL}functional/`;
  const [metadata, response] = await Promise.all([fetch(`${base}manifest.json`), fetch(`${base}cortex.bin`)]);
  if (!metadata.ok || !response.ok) throw new Error('Functional cortical surface could not be loaded');
  const manifest = await metadata.json(), raw = await response.arrayBuffer();
  const root = new T.Group(), contexts = [], parcels = [];
  root.visible = false;
  for (const surface of manifest.surfaces) {
    const positions = new Float32Array(raw, surface.positions, surface.vertexCount * 3);
    const indices = new Uint32Array(raw, surface.indices, surface.indexCount);
    const labels = new Uint32Array(raw, surface.labels, surface.vertexCount);
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    geometry.setIndex(new T.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();
    const normals = geometry.getAttribute('normal').array;
    const context = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: '#a9aea7', roughness: 0.9, side: T.DoubleSide }));
    context.userData.side = surface.side;
    contexts.push(context); root.add(context);
    const buffers = new Map(surface.parcels.map(p => [p.id, { positions: [], normals: [] }]));
    const vertex = i => ({ p: Array.from(positions.subarray(i * 3, i * 3 + 3)), n: Array.from(normals.subarray(i * 3, i * 3 + 3)) });
    const average = vs => ({ p: [0, 1, 2].map(k => vs.reduce((sum, v) => sum + v.p[k], 0) / vs.length), n: [0, 1, 2].map(k => vs.reduce((sum, v) => sum + v.n[k], 0) / vs.length) });
    const add = (id, vs) => { const target = buffers.get(id); if (target) for (const v of vs) { target.positions.push(...v.p); target.normals.push(...v.n); } };
    for (let i = 0; i < indices.length; i += 3) {
      const ids = Array.from(indices.subarray(i, i + 3));
      const keys = ids.map(v => labels[v]), vs = ids.map(vertex);
      if (keys.every(k => k === keys[0])) { add(keys[0], vs); continue; }
      // Vertex labels meet at edge midpoints and the face centroid; no parcel leaks across a whole boundary triangle.
      const center = average(vs);
      for (let k = 0; k < 3; k++) {
        const next = average([vs[k], vs[(k + 1) % 3]]), previous = average([vs[k], vs[(k + 2) % 3]]);
        add(keys[k], [vs[k], next, center, vs[k], center, previous]);
      }
    }
    for (const parcel of surface.parcels) {
      const data = buffers.get(parcel.id), geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(data.positions, 3));
      geometry.setAttribute('normal', new T.Float32BufferAttribute(data.normals, 3));
      geometry.computeBoundingBox();
      const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: '#df8e37', roughness: 0.75, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
      mesh.userData = { ...parcel, side: surface.side, nodeId: parcel.id };
      mesh.visible = false;
      mesh.renderOrder = 2;
      parcels.push(mesh); root.add(mesh);
    }
  }
  // RAS millimetres to the viewer: R=+X, S=+Y, A=-Z, by rotation and uniform scaling only.
  root.rotation.x = -Math.PI / 2;
  root.updateMatrixWorld(true);
  const box = new T.Box3();
  for (const mesh of contexts) box.expandByObject(mesh);
  const scale = 2.8 / Math.max(...box.getSize(new T.Vector3()).toArray());
  root.scale.setScalar(scale);
  root.position.copy(box.getCenter(new T.Vector3())).multiplyScalar(-scale);
  root.updateMatrixWorld(true);
  let active = [];
  return {
    root,
    update(state) {
      const area = FUNCTIONAL_AREAS.find(a => a.id === state.selectedFunction);
      root.visible = state.mode === 'anatomy' && Boolean(area?.parcels.length);
      active = [];
      for (const mesh of parcels) {
        mesh.visible = root.visible && (state.hemisphere === 'both' || mesh.userData.side === state.hemisphere) && area.parcels.includes(mesh.userData.name);
        if (mesh.visible) active.push(mesh);
      }
      for (const mesh of contexts) {
        mesh.visible = root.visible && !state.isolate && (state.hemisphere === 'both' || mesh.userData.side === state.hemisphere);
        mesh.material.opacity = state.opacity;
        mesh.material.transparent = state.opacity < 1;
        mesh.material.depthWrite = state.opacity >= 0.95;
      }
    },
    selected: () => active,
    bounds() {
      const box = new T.Box3();
      for (const mesh of contexts.filter(m => active.some(p => p.userData.side === m.userData.side))) box.expandByObject(mesh);
      return box;
    },
    pick(raycaster) { return raycaster.intersectObjects(active, false)[0]?.object.userData; },
  };
}
