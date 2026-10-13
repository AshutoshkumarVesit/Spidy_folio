import { createTriangleRenderer } from './triangles.js?v=soft-particles-2';
const scene = document.querySelector('#scene');
const canvas = scene.querySelector('canvas');
const front = scene.querySelector('.front');
const back = scene.querySelector('.back');
const art = scene.querySelector('.hero-art');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
// Explicit preview opt-in; the normal page respects OS settings.
const fullMotionPreview = new URLSearchParams(location.search).get('motion') === 'full';
const reducedMotion = { get matches() { return !fullMotionPreview && motionPreference.matches; } };
const pointer = { segments: [] };
let lastPosition = null;
let touchDown = false;
let frame = 0;

function locate(event) {
  const rect = art.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  };
}
scene.addEventListener('pointerenter', event => { lastPosition = locate(event); });
scene.addEventListener('pointermove', event => {
  const position = locate(event);
  if (lastPosition && (event.pointerType !== 'touch' || touchDown) &&
      (position.x !== lastPosition.x || position.y !== lastPosition.y)) {
    pointer.segments.push({ from: lastPosition, to: position });
    // Bound input work when rendering resumes after a backgrounded tab.
    if (pointer.segments.length > 12) pointer.segments.shift();
  }
  lastPosition = position;
});
function stopInput() { lastPosition = null; pointer.segments.length = 0; }
scene.addEventListener('pointerleave', stopInput);
scene.addEventListener('pointerdown', event => {
  lastPosition = locate(event);
  if (event.pointerType === 'touch') {
    touchDown = true;
    scene.setPointerCapture(event.pointerId);
  }
});
function release(event) {
  if (event.pointerType === 'touch') { touchDown = false; stopInput(); }
}
scene.addEventListener('pointerup', release);
scene.addEventListener('pointercancel', release);
scene.addEventListener('keydown', event => {
  if (event.target !== scene || event.repeat) return;
  if (event.code !== 'Space' && event.code !== 'Enter') return;
  event.preventDefault();
  pointer.segments.push({ from: { x: .45, y: .5 }, to: { x: .55, y: .5 } });
});
scene.addEventListener('blur', stopInput);
window.addEventListener('blur', stopInput);

function imageReady(image) {
  if (image.complete) return image.naturalWidth ? Promise.resolve() : Promise.reject(new Error('Image failed to load'));
  return new Promise((resolve, reject) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', reject, { once: true });
  });
}
function fallback() {
  scene.classList.remove('ready');
  canvas.style.display = 'none';
  return () => { pointer.segments.length = 0; };
}
async function start() {
  await imageReady(front);
  let draw;
  let sceneVisible = true;
  try {
    await imageReady(back);
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) throw new Error('WebGL unavailable');
    draw = createTriangleRenderer(gl, canvas, scene, front, back, pointer, reducedMotion);
    draw(0);
    scene.classList.add('ready');
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      draw = fallback();
    });
  } catch (error) {
    console.warn('Using static image fallback:', error);
    draw = fallback();
  }
  function animate(timestamp) {
    if (document.body.classList.contains('play-modal')) { frame = 0; return; }
    draw(timestamp);
    frame = requestAnimationFrame(animate);
  }
  function resume() {
    cancelAnimationFrame(frame);
    stopInput();
    if (document.hidden || !sceneVisible || document.body.classList.contains('play-modal')) return;
    frame = requestAnimationFrame(animate);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); stopInput(); }
    else resume();
  });
  document.addEventListener('portfolio:overlay', event => {
    if (event.detail.active) { cancelAnimationFrame(frame); stopInput(); }
    else resume();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      if (sceneVisible) resume();
      else { cancelAnimationFrame(frame); stopInput(); }
    }).observe(scene);
  }
  resume();
}
start().catch(error => console.error('Home image could not load:', error));
