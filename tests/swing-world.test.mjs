import test from 'node:test';
import assert from 'node:assert/strict';
import { SwingWorld } from '../swing-world.mjs';

test('a new press attaches one dot ahead of the nearest without changing momentum', () => {
  for (const x of [-330, 65, 335, 435, 775]) {
    const world = new SwingWorld(900, 480);
    Object.assign(world.player, { x, y: 210, vx: 185, vy: -25 });
    const dots = Array.from({ length: 16 }, (_, i) => world.anchorAt(i - 5));
    const closest = dots.reduce((a, b) => Math.hypot(a.x - x, a.y - 210) < Math.hypot(b.x - x, b.y - 210) ? a : b);
    world.hold(true);
    assert.equal(world.anchor.id, closest.id + 1);
    assert.ok(world.anchor.x > world.player.x);
    assert.equal(world.rope, Math.hypot(world.player.x - world.anchor.x, world.player.y - world.anchor.y));
    assert.equal(world.player.vx, 185); assert.equal(world.player.vy, -25);
  }
});

test('holding one web swings in both directions without automatic switching', () => {
  const world = new SwingWorld(900, 420);
  world.hold(true);
  const anchor = world.anchor;
  let forward = false, backward = false, passedDot = false, cameraMovedBackward = false;
  for (let i = 0; i < 1200; i++) {
    const previousCamera = world.camera;
    world.step(1 / 120);
    forward ||= world.player.vx > 50;
    backward ||= world.player.vx < -50;
    passedDot ||= world.player.x > anchor.x + 45;
    cameraMovedBackward ||= world.camera < previousCamera;
    assert.equal(world.anchor, anchor);
    assert.ok(Math.hypot(world.player.x - anchor.x, world.player.y - anchor.y) <= world.rope + .00001);
  }
  assert.ok(forward && backward && passedDot && cameraMovedBackward);
  assert.equal(world.hearts, 3);
});

test('release keeps exact momentum in either direction and free flight has no horizontal motor', () => {
  for (const vx of [-160, 160]) {
    const world = new SwingWorld();
    Object.assign(world.player, { x: 335, y: 220, vx, vy: -75 });
    world.hold(true); world.hold(false);
    assert.equal(world.anchor, null);
    assert.equal(world.player.vx, vx); assert.equal(world.player.vy, -75);
    const x = world.player.x;
    world.step(1 / 120);
    assert.equal(world.player.vx, vx);
    assert.ok(Math.abs(world.player.x - (x + vx / 120)) < 1e-9);
  }
});

test('holding again cannot retarget; release and a fresh press can', () => {
  const world = new SwingWorld(); world.hold(true);
  const first = world.anchor;
  Object.assign(world.player, { x: 330, y: 210 });
  world.hold(true); assert.equal(world.anchor, first);
  world.hold(false); assert.equal(world.anchor, null);
  world.hold(true); assert.equal(world.anchor.id, 2);
});

test('collision breaks the web and resize keeps the attached dot aligned', () => {
  const world = new SwingWorld(); world.hold(true);
  const id = world.anchor.id;
  world.resize(320, 300);
  const dot = world.anchorAt(id);
  assert.equal(world.anchor.id, dot.id); assert.equal(world.anchor.x, dot.x);
  assert.ok(Math.abs(world.anchor.y - dot.y) < 1e-9);
  world.hit(); assert.equal(world.anchor, null); assert.equal(world.held, false);
});

test('a finished round can detach its final web', () => {
  const world = new SwingWorld(); world.hold(true); world.elapsed = 29.999;
  world.step(1 / 120); assert.equal(world.finished, true);
  world.hold(false); assert.equal(world.anchor, null); assert.equal(world.held, false);
});

test('score combines new forward distance and unique coins without rewarding backtracking', () => {
  const world = new SwingWorld();
  const move = x => { Object.assign(world.player, { x, y: 220, vx: 0, vy: 0 }); world.step(1 / 120); };
  move(215); assert.equal(world.distance, 15); assert.equal(world.score, 15);
  move(185); assert.equal(world.distance, 15); assert.equal(world.score, 15);
  move(365); assert.equal(world.distance, 30); assert.equal(world.score, 30);
  const coin = world.tokens()[0];
  Object.assign(world.player, { x: coin.x, y: coin.y, vx: 0, vy: 0 });
  world.step(1 / 120);
  assert.equal(world.collected.size, 1); assert.equal(world.coinScore, 10); assert.equal(world.score, 40);
  world.step(1 / 120); assert.equal(world.score, 40);
  world.hit(); assert.equal(world.score, 40);
  world.reset(); assert.equal(world.score, 0); assert.equal(world.distance, 0); assert.equal(world.collected.size, 0);
});

test('dots and coins cover every playable height band evenly with stable positions', () => {
  const world = new SwingWorld(2200, 480);
  const counts = dots => dots.reduce((bins, dot) => { bins[Math.floor((dot.y / world.height - .1) / .2)]++; return bins; }, [0, 0, 0, 0]);
  const dots = Array.from({ length: 16 }, (_, i) => world.anchorAt(i - 8));
  const coins = world.tokens().slice(0, 16);
  assert.deepEqual(counts(dots), [4, 4, 4, 4]); assert.deepEqual(counts(coins), [4, 4, 4, 4]);
  assert.ok([...dots, ...coins].every(dot => dot.y > 25 && dot.y < world.height - 26));
  const stable = world.anchorAt(3); world.elapsed = 8;
  assert.deepEqual(world.anchorAt(3), stable);
  const nearest = world.nearestAnchor(); world.hold(true);
  assert.equal(world.anchor.id, nearest.id + 1);
});

test('a connected web can swing below ground, while releasing there costs one heart and respawns above', () => {
  const world = new SwingWorld(900, 420);
  Object.assign(world.player, { x: 200, y: 500, vx: 185, vy: 0 });
  world.hold(true);
  const anchor = world.anchor;
  for (let i = 0; i < 60; i++) {
    world.step(1 / 120);
    assert.equal(world.anchor, anchor); assert.equal(world.hearts, 3);
    assert.ok(world.player.y > world.height - 26);
  }
  const x = world.player.x, score = world.score;
  world.hold(false); world.step(1 / 120);
  assert.equal(world.hearts, 2); assert.equal(world.anchor, null); assert.equal(world.held, false);
  assert.equal(world.player.y, world.height * .36); assert.equal(world.player.vy, -150);
  assert.ok(world.player.x >= x); assert.ok(world.score >= score);
  world.step(1 / 120); assert.equal(world.hearts, 2);
});

test('each detached ground fall costs one heart even during the drone cooldown, and the last ends the round', () => {
  const world = new SwingWorld();
  const fall = () => { Object.assign(world.player, { y: world.height - 20, vy: 100 }); world.step(1 / 120); };
  for (const hearts of [2, 1, 0]) {
    fall(); assert.equal(world.hearts, hearts); assert.equal(world.player.y, world.height * .36);
    assert.equal(world.lastHit, true);
  }
  assert.equal(world.finished, true);
  fall(); assert.equal(world.hearts, 0);
});
