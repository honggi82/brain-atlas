import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { PointerTap } from './pointer-tap.js';
import { CATEGORIES } from './knowledge.js';
import { partName, ui } from './i18n.js';
import { createTractLayer } from './tract-layer.js';
import { lobeForPart } from './lobes.js';

export async function createScene(host, parts, callbacks, fiberManifest) {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0xf5f4f0, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', ui('뇌 3D 해부도. 드래그로 회전, 휠로 확대, 구조를 클릭해 선택합니다.'));
  canvas.setAttribute('role', 'img');
  host.prepend(canvas);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minDistance = 0.35;
  controls.maxDistance = 18;
  scene.add(new T.HemisphereLight(0xffffff, 0x827b71, 2.2));
  for (const [color, intensity, xyz] of [[0xfff3df, 3, [4, 6, 5]], [0xe0edff, 2, [-4, 2, -4]]]) {
    const light = new T.DirectionalLight(color, intensity);
    light.position.set(...xyz);
    scene.add(light);
  }
  const model = new T.Group();
  scene.add(model);
  const fibers = createTractLayer(fiberManifest, {
    onChange() { dirty = true; const stats = fibers.stats(); host.dataset.visibleFiberBundles = stats.bundles; host.dataset.visibleFibers = stats.streamlines; },
    onReady() { if (fiberMode) view('oblique'); },
    onDetailReady() { if (fiberMode && current?.fiber) fit(fibers.bounds(current.fiber)); },
    onStatus: callbacks.onFiberStatus,
  });
  scene.add(fibers.root);
  const draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  draco.setWorkerLimit(2);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const meshes = new Map();
  const partMap = new Map(parts.map(p => [p.id, p]));
  let disposed = false, dirty = true, frame, current, loaded = false, fiberMode = false;
  let fullBox, front = new T.Vector3(0, 0, 1), left = new T.Vector3(1, 0, 0);
  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const tap = new PointerTap();
  const floating = host.querySelector('.floating-label');
  const hover = host.querySelector('.hover-label');

  function render() {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    controls.update();
    if (!dirty) return;
    renderer.render(scene, camera);
    dirty = false;
    const pieces = fiberMode ? (fibers.selected() ? [fibers.selected()] : null) : selectedPieces(current?.selected);
    if (pieces?.some(mesh => mesh.visible)) {
      const point = bounds(pieces.filter(mesh => mesh.visible)).getCenter(new T.Vector3()).project(camera);
      floating.hidden = point.z > 1 || Math.abs(point.x) > 0.95 || Math.abs(point.y) > 0.94;
      floating.style.left = `${(point.x + 1) * host.clientWidth / 2}px`;
      floating.style.top = `${(1 - point.y) * host.clientHeight / 2}px`;
    } else floating.hidden = true;
  }
  controls.addEventListener('change', () => { dirty = true; });
  const resize = () => {
    camera.aspect = host.clientWidth / Math.max(host.clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
    dirty = true;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function bounds(pieces) {
    const box = new T.Box3();
    for (const mesh of pieces) box.expandByObject(mesh);
    return box;
  }

  function selectedPieces(id) {
    if (current?.selectedFunction) return [...meshes.entries()].filter(([id]) => current.referenceIds.has(id)).flatMap(([, pieces]) => pieces);
    return current?.selectedLobe
      ? [...meshes.entries()].filter(([key]) => lobeForPart(partMap.get(key))?.id === current.selectedLobe).flatMap(([, pieces]) => pieces)
      : meshes.get(id);
  }

  function fit(box = fiberMode ? fibers.bounds() : fullBox, direction) {
    if (!box || box.isEmpty()) return;
    const center = box.getCenter(new T.Vector3());
    const vertical = T.MathUtils.degToRad(camera.fov / 2);
    const dir = direction || camera.position.clone().sub(controls.target).normalize();
    const right = new T.Vector3().crossVectors(camera.up, dir).normalize();
    const up = new T.Vector3().crossVectors(dir, right).normalize();
    let distance = 0.42;
    const boxes = !fiberMode && box === fullBox ? [...meshes.entries()].filter(([id]) => partMap.get(id).category !== 'tracts').map(([, pieces]) => bounds(pieces)) : [box];
    for (const target of boxes) for (const x of [target.min.x, target.max.x]) for (const y of [target.min.y, target.max.y]) for (const z of [target.min.z, target.max.z]) {
      const offset = new T.Vector3(x, y, z).sub(center);
      distance = Math.max(distance, offset.dot(dir) + Math.max(Math.abs(offset.dot(up)) / Math.tan(vertical), Math.abs(offset.dot(right)) / (Math.tan(vertical) * camera.aspect)) * 1.08);
    }
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(dir, distance);
    controls.update();
    dirty = true;
  }

  function update(state) {
    current = state;
    const previousMode = fiberMode;
    fiberMode = state.mode === 'tractography' && state.representation === 'streamlines';
    model.visible = !fiberMode;
    scene.background = fiberMode ? new T.Color('#101b25') : null;
    fibers.update(state);
    host.dataset.renderer = fiberMode ? 'streamlines' : 'anatomy';
    if (!fiberMode) { host.dataset.visibleFibers = 0; host.dataset.visibleFiberBundles = 0; }
    if (previousMode !== fiberMode) view('oblique');
    canvas.setAttribute('aria-label', ui('뇌 3D 해부도. 드래그로 회전, 휠로 확대, 구조를 클릭해 선택합니다.'));
    for (const [id, pieces] of meshes) {
      const part = partMap.get(id);
      const hemisphere = state.hemisphere === 'both' || part.side === 'median' || part.side === state.hemisphere;
      const active = state.selectedFunction ? state.referenceIds.has(id) : state.selectedLobe ? lobeForPart(part)?.id === state.selectedLobe : id === state.selected;
      let opacity = part.category === 'cortex' || part.category === 'white_matter' ? state.opacity : 1;
      if (active) opacity = 1;
      for (const mesh of pieces) {
        mesh.visible = hemisphere && state.categories.has(part.category) && !state.hidden.has(id)
          && (!state.isolate || active)
          && (state.mode !== 'tractography' || part.category === 'cortex' || (active && !state.fiberHidden.has(state.fiber)));
        mesh.material.opacity = opacity;
        mesh.material.transparent = opacity < 1;
        mesh.material.depthWrite = opacity >= 0.95;
        mesh.material.color.copy(mesh.userData.baseColor);
        if (state.mode === 'tractography') mesh.material.color.set('#b5bcb5');
        mesh.material.emissive.set(active && !state.selectedLobe ? 0x246d59 : 0x000000);
        mesh.material.emissiveIntensity = active && !state.selectedLobe ? 0.3 : 0;
        if ((state.selectedLobe || state.selectedFunction) && !active) mesh.material.color.multiplyScalar(0.55);
        if (active && !state.selectedLobe) mesh.material.color.set(state.mode === 'tractography' ? '#087d67' : '#82b6a1');
        mesh.renderOrder = active ? 2 : opacity < 0.95 ? 1 : 0;
      }
    }
    host.dataset.visibleStructures = fiberMode ? 0 : [...meshes.values()].filter(pieces => pieces.some(m => m.visible)).length;
    host.dataset.selectedLobe = state.selectedLobe || '';
    host.dataset.selectedFunction = state.selectedFunction || '';
    host.dataset.selectedStructures = fiberMode ? 0 : (selectedPieces(state.selected) || []).filter(m => m.visible).reduce((ids, m) => ids.add(m.userData.nodeId), new Set()).size;
    dirty = true;
  }

  function pick(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(pointer, camera);
    if (fiberMode) return fibers.pick(raycaster);
    const targets = [...meshes.values()].flat().filter(m => m.visible && m.material.opacity > 0.2);
    return raycaster.intersectObjects(targets, false)[0]?.object.userData.nodeId;
  }
  const down = e => { hover.hidden = true; tap.down(e.pointerId, e.clientX, e.clientY, e.pointerType === 'touch' ? 12 : 5); };
  const move = e => {
    tap.move(e.pointerId, e.clientX, e.clientY);
    if (!loaded || e.buttons || e.pointerType === 'touch') { hover.hidden = true; return; }
    const id = pick(e);
    canvas.style.cursor = id == null ? 'grab' : 'pointer';
    hover.hidden = id == null;
    if (id != null) {
      const part = fiberMode ? fiberManifest.bundles.find(b => b.id === id) : partMap.get(id);
      const lobe = !fiberMode && lobeForPart(part);
      hover.textContent = `${partName(part)}${lobe ? ` · ${partName(lobe)}` : ''}`;
      const rect = canvas.getBoundingClientRect();
      hover.style.left = `${Math.min(host.clientWidth - 170, Math.max(8, e.clientX - rect.left + 12))}px`;
      hover.style.top = `${Math.max(8, e.clientY - rect.top - 34)}px`;
    }
  };
  const up = e => { if (tap.up(e.pointerId, e.clientX, e.clientY) && loaded) { const id = pick(e); if (id != null) { if (fiberMode) callbacks.onFiberSelect(id); else callbacks.onSelect(id); } } };
  const cancel = e => tap.cancel(e.pointerId);
  const leave = () => { hover.hidden = true; };
  const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: cancel, pointerleave: leave };
  for (const [name, fn] of Object.entries(listeners)) canvas.addEventListener(name, fn);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    controls.dispose();
    draco.dispose();
    fibers.dispose();
    for (const [name, fn] of Object.entries(listeners)) canvas.removeEventListener(name, fn);
    scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    renderer.dispose();
    canvas.remove();
  }

  try {
    const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/brain.glb`, e => callbacks.onProgress(e.total ? Math.round(e.loaded / e.total * 90) : 40));
    const supplement = await fetch(`${import.meta.env.BASE_URL}models/insula.bin`);
    if (!supplement.ok) throw new Error(`Insula geometry: HTTP ${supplement.status}`);
    const insulaBuffer = await supplement.arrayBuffer();
    for (const part of parts.filter(p => p.geometryFile === 'insula.bin')) {
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(insulaBuffer, part.positions, part.vertexCount * 3), 3));
      geometry.setIndex(new T.BufferAttribute(new Uint32Array(insulaBuffer, part.indices, part.indexCount), 1));
      geometry.computeVertexNormals();
      const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial());
      mesh.name = `Insula.${part.side}`;
      mesh.userData.bx_id = part.id;
      gltf.scene.add(mesh);
    }
    model.add(gltf.scene);
    gltf.scene.updateMatrixWorld(true);
    const core = new T.Box3();
    gltf.scene.traverse(mesh => {
      if (!mesh.isMesh) return;
      let owner = mesh;
      while (owner && owner.userData.bx_id == null) owner = owner.parent;
      const ex = owner?.userData || {};
      const part = partMap.get(ex.bx_id);
      if (!part) { mesh.visible = false; return; }
      if (part.category !== 'tracts') core.expandByObject(mesh);
      const color = new T.Color(CATEGORIES[part.category].color);
      if (part.category === 'cortex') {
        color.set(lobeForPart(part).color);
        if (/sulcus|sulci|Lat Fis/.test(part.label) && !/gyrus|gyri/.test(part.label)) color.multiplyScalar(0.78);
      }
      const original = mesh.material;
      mesh.material = new T.MeshStandardMaterial({ color, roughness: 0.76, metalness: 0, side: T.DoubleSide });
      original.dispose();
      mesh.userData.nodeId = part.id;
      mesh.userData.baseColor = color;
      if (!meshes.has(part.id)) meshes.set(part.id, []);
      meshes.get(part.id).push(mesh);
    });
    if (meshes.size !== parts.length) throw new Error(`Expected ${parts.length} structures, loaded ${meshes.size}`);
    host.dataset.structures = meshes.size;
    host.dataset.primitives = [...meshes.values()].reduce((count, pieces) => count + pieces.length, 0);
    const center = core.getCenter(new T.Vector3());
    gltf.scene.position.sub(center);
    model.scale.setScalar(2.8 / Math.max(...core.getSize(new T.Vector3()).toArray()));
    model.updateMatrixWorld(true);
    fullBox = new T.Box3();
    for (const [id, pieces] of meshes) if (partMap.get(id).category !== 'tracts') fullBox.union(bounds(pieces));
    function mean(predicate) {
      const selected = [...meshes.entries()].filter(([id]) => predicate(partMap.get(id)));
      return selected.reduce((v, [, pieces]) => v.add(bounds(pieces).getCenter(new T.Vector3())), new T.Vector3()).divideScalar(selected.length || 1);
    }
    front = mean(p => p.label === 'Transverse frontopolar gyrus and sulcus').sub(mean(p => p.label === 'Occipital pole'));
    front.y = 0; front.normalize();
    left = mean(p => p.category === 'cortex' && p.side === 'left').sub(mean(p => p.category === 'cortex' && p.side === 'right'));
    left.y = 0; left.normalize();
    loaded = true;
    fit(fullBox, front.clone().addScaledVector(left, 1.4).add(new T.Vector3(0, 0.35, 0)).normalize());
    callbacks.onProgress(100);
    render();
  } catch (error) { dispose(); throw error; }

  function view(view) {
    const anterior = fiberMode ? new T.Vector3(0, 0, -1) : front;
    const lateral = fiberMode ? new T.Vector3(-1, 0, 0) : left;
    const dirs = { front: anterior, back: anterior.clone().negate(), left: lateral, right: lateral.clone().negate(), top: new T.Vector3(0, 1, 0.001), oblique: anterior.clone().addScaledVector(lateral, 1.4).add(new T.Vector3(0, 0.35, 0)).normalize() };
    fit(fiberMode ? fibers.bounds() : fullBox, dirs[view] || dirs.oblique);
  }

  return {
    update,
    dispose,
    focus(id) { if (fiberMode) fit(fibers.bounds(current.fiber)); else { const pieces = selectedPieces(id); if (pieces) fit(bounds(pieces.filter(m => m.visible))); } },
    view,
    retryFibers() { fibers.retry(); },
    zoom(factor) { camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target); controls.update(); dirty = true; },
    image() { renderer.render(scene, camera); return canvas.toDataURL('image/png'); },
  };
}
