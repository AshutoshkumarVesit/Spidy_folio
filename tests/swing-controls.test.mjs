import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebSwing } from '../web-swing.js';

test('keyboard and pointer grips attach only on fresh presses and detach on their releases', () => {
  class Element extends EventTarget {
    constructor() { super(); this.dataset = {}; this.textContent = ''; this.hidden = false; }
    setAttribute() {}
    focus() {}
    after() {}
    setPointerCapture() {}
    getBoundingClientRect() { return { width: 900, height: 420 }; }
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  const canvas = get('#swing-canvas');
  const gradient = { addColorStop() {} };
  const context = new Proxy({}, { get: (_, name) => name === 'createLinearGradient' || name === 'createRadialGradient' ? () => gradient : () => {} });
  canvas.getContext = () => context;
  const dialog = { open: true, querySelector: get };
  const documentMock = new EventTarget(); documentMock.hidden = false; documentMock.createElement = () => new Element();
  const frames = new Map(); let frameId = 0, time = 0;
  const replacements = {
    document: documentMock, window: new EventTarget(), devicePixelRatio: 1,
    localStorage: { getItem: () => null, setItem() {} },
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id)
  };
  const originals = new Map(Object.keys(replacements).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.entries(replacements).forEach(([key, value]) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true }));
  const fire = (element, type, properties = {}) => { const event = new Event(type, { cancelable: true }); Object.assign(event, properties); element.dispatchEvent(event); };
  const advance = count => { for (let i = 0; i < count; i++) { time += 1000 / 60; const work = [...frames.values()]; frames.clear(); work.forEach(callback => callback(time)); } };
  try {
    const game = createWebSwing(dialog); game.open(); fire(get('#game-start'), 'click');
    fire(canvas, 'keydown', { code: 'Space', key: ' ', repeat: true });
    assert.equal(canvas.dataset.state, 'ready'); assert.equal(canvas.dataset.web, 'free');
    fire(canvas, 'keydown', { code: 'Space', key: ' ', repeat: false });
    const dot = canvas.dataset.anchor;
    assert.equal(canvas.dataset.web, 'attached');
    assert.equal(dot, '1');
    advance(180);
    assert.equal(canvas.dataset.anchor, dot); assert.equal(canvas.dataset.web, 'attached');
    const velocity = canvas.dataset.velocityX;
    fire(canvas, 'keyup', { code: 'Space' });
    assert.equal(canvas.dataset.web, 'free'); assert.equal(canvas.dataset.velocityX, velocity);
    fire(canvas, 'keydown', { code: 'Space', key: ' ', repeat: true });
    assert.equal(canvas.dataset.web, 'free');
    fire(canvas, 'pointerdown', { pointerId: 1, button: 0, isPrimary: true });
    assert.equal(canvas.dataset.web, 'attached');
    fire(canvas, 'keyup', { code: 'Space' }); assert.equal(canvas.dataset.web, 'attached');
    fire(canvas, 'pointerup', { pointerId: 1 }); assert.equal(canvas.dataset.web, 'free');
    fire(canvas, 'keydown', { code: 'Space', key: ' ', repeat: false });
    assert.equal(canvas.dataset.web, 'attached');
    fire(get('#game-pause'), 'click');
    assert.equal(canvas.dataset.state, 'paused'); assert.equal(canvas.dataset.web, 'free');
    fire(get('#game-start'), 'click'); advance(1800);
    assert.equal(canvas.dataset.state, 'finished');
    const result = get('#game-overlay-description').textContent.match(/(\d+) m forward \+ (\d+) coins\.\n(\d+) distance points \+ (\d+) coin points = (\d+)/);
    assert.ok(result); assert.equal(Number(result[2]), Number(get('#game-coins').textContent));
    assert.equal(Number(result[5]), Number(result[3]) + Number(result[4]));
    assert.equal(Number(result[5]), Number(get('#game-score').textContent));
    game.stop(); assert.equal(frames.size, 0);
  } finally {
    for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});
