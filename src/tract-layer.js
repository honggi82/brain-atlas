import * as T from 'three';
import { decodeStreamlines, segmentData } from './streamlines.js';

export function streamlineGeometry(data, first = 0, count = data.count) {
  const segments = segmentData(data, first, count);
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(segments.positions, 3));
  geometry.setAttribute('color', new T.BufferAttribute(segments.colors, 3));
  // Bake the display transform so Three.js line-picking tolerance uses world units.
  geometry.applyMatrix4(new T.Matrix4().makeRotationX(-Math.PI / 2).scale(new T.Vector3(0.018, 0.018, 0.018)));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return { geometry, ends: segments.ends };
}

export function createTractLayer(manifest, callbacks) {
  const root = new T.Group();
  root.visible = false;
  const overview = new Map(), details = new Map();
  let state, ready = false, disposed = false, initialRequest, activeRequest, requestedId;
  const controllers = new Set();

  async function read(entry, controller) {
    const response = await fetch(`${import.meta.env.BASE_URL}tractography/${entry.file}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${entry.file}`);
    const compressed = await response.arrayBuffer();
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', compressed))].map(b => b.toString(16).padStart(2, '0')).join('');
    if (hash !== entry.sha256) throw new Error('Streamline checksum mismatch');
    const decompressed = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    return decodeStreamlines(await new Response(decompressed).arrayBuffer());
  }

  function lineObject(data, first = 0, count = data.count) {
    const { geometry, ends } = streamlineGeometry(data, first, count);
    const line = new T.LineSegments(geometry, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.88, depthWrite: false, toneMapped: false }));
    line.userData.ends = ends;
    root.add(line);
    return line;
  }

  async function init() {
    if (ready) return;
    if (initialRequest) return initialRequest;
    const controller = new AbortController(); controllers.add(controller);
    initialRequest = (async () => {
      const data = await read(manifest.overview, controller);
      if (disposed) return;
      for (const bundle of manifest.bundles) {
        const line = lineObject(data, bundle.overviewStart, bundle.overviewCount);
        line.userData.bundleId = bundle.id;
        overview.set(bundle.id, line);
      }
      root.updateMatrixWorld(true);
      ready = true;
      callbacks.onReady();
    })().finally(() => { controllers.delete(controller); initialRequest = null; });
    return initialRequest;
  }

  function paint() {
    if (!state) return;
    for (const bundle of manifest.bundles) {
      const active = state.fiber === bundle.id;
      const hemisphere = state.hemisphere === 'both' || ['median', 'both'].includes(bundle.side) || bundle.side === state.hemisphere;
      const visible = !(state.tract && !state.fiber) && hemisphere && !state.fiberHidden.has(bundle.id) && (active || state.fiberContext || !state.fiber);
      for (const [collection, detail] of [[overview, false], [details, true]]) {
        const line = collection.get(bundle.id);
        if (!line) continue;
        line.visible = visible && (detail ? active : !(active && details.has(bundle.id)));
        const colored = active || (!state.fiber && state.mode === 'tractography');
        if (line.material.vertexColors !== colored) { line.material.vertexColors = colored; line.material.needsUpdate = true; }
        line.material.color.set(colored ? '#ffffff' : '#788b95');
        line.material.opacity = colored ? 0.88 : 0.15;
        line.renderOrder = active ? 2 : 0;
        const number = active || !state.fiber ? Math.max(1, Math.ceil(line.userData.ends.length * state.fiberDensity)) : line.userData.ends.length;
        line.geometry.setDrawRange(0, line.userData.ends[number - 1]);
      }
    }
    callbacks.onChange();
  }

  async function requestSelected() {
    const id = state.fiber;
    if (!id) { requestedId = null; activeRequest?.abort(); callbacks.onStatus(state.tract ? 'unavailable' : 'ready'); return; }
    if (id === requestedId) return;
    requestedId = id;
    activeRequest?.abort();
    if (details.has(id)) { callbacks.onStatus('ready'); paint(); callbacks.onDetailReady(); return; }
    const entry = manifest.bundles.find(b => b.id === id);
    if (!entry) { callbacks.onStatus('unavailable'); return; }
    const controller = new AbortController(); activeRequest = controller; controllers.add(controller);
    callbacks.onStatus('loading');
    try {
      const data = await read(entry, controller);
      if (disposed || controller.signal.aborted || state.fiber !== id) return;
      const line = lineObject(data); line.userData.bundleId = id;
      details.set(id, line);
      while (details.size > 4) {
        const oldest = details.keys().next().value;
        const old = details.get(oldest); root.remove(old); old.geometry.dispose(); old.material.dispose(); details.delete(oldest);
      }
      paint(); callbacks.onStatus('ready'); callbacks.onDetailReady();
    } catch (error) {
      if (!controller.signal.aborted && !disposed && state.fiber === id) callbacks.onStatus('error', error.message);
    } finally { controllers.delete(controller); }
  }

  return {
    root,
    async update(next) {
      state = next;
      root.visible = next.mode === 'tractography' && next.representation === 'streamlines';
      if (!root.visible) { activeRequest?.abort(); requestedId = undefined; return; }
      try {
        if (!ready) callbacks.onStatus('loading');
        await init();
        if (disposed || !root.visible) return;
        paint(); await requestSelected();
      } catch (error) { if (!disposed && error.name !== 'AbortError') callbacks.onStatus('error', error.message); }
    },
    bounds(id) {
      const object = details.get(id) || overview.get(id);
      return new T.Box3().setFromObject(object || root);
    },
    selected() { return details.get(state?.fiber) || overview.get(state?.fiber); },
    stats() {
      const lines = [...overview.values(), ...details.values()].filter(line => root.visible && line.visible);
      return { bundles: lines.length, streamlines: lines.reduce((sum, line) => sum + line.userData.ends.filter(end => end <= line.geometry.drawRange.count).length, 0) };
    },
    pick(raycaster) {
      if (!root.visible) return;
      raycaster.params.Line.threshold = 0.009;
      return raycaster.intersectObjects([...details.values(), ...overview.values()].filter(l => l.visible), false)[0]?.object.userData.bundleId;
    },
    retry() { requestedId = undefined; return this.update(state); },
    dispose() {
      disposed = true; controllers.forEach(controller => controller.abort());
      root.traverse(line => { if (line.isLineSegments) { line.geometry.dispose(); line.material.dispose(); } });
    },
  };
}
