import { SwingWorld, clamp } from './swing-world.mjs?v=5';

export function createWebSwing(dialog) {
  const canvas = dialog.querySelector('#swing-canvas');
  const ctx = canvas.getContext('2d');
  const overlay = dialog.querySelector('#game-overlay');
  const start = dialog.querySelector('#game-start');
  const pause = dialog.querySelector('#game-pause');
  const score = dialog.querySelector('#game-score');
  const distance = dialog.querySelector('#game-distance');
  const coins = dialog.querySelector('#game-coins');
  const timer = dialog.querySelector('#game-time');
  const hearts = dialog.querySelector('#game-hearts');
  const bestLabel = dialog.querySelector('#game-best');
  const status = dialog.querySelector('#game-status');
  const world = new SwingWorld();
  const hint = document.createElement('p'); hint.className = 'game-ready-hint'; hint.textContent = 'HOLD MOUSE, TOUCH OR SPACE TO BEGIN'; hint.hidden = true; canvas.after(hint);
  let mode = 'idle', frame = 0, previous = 0, accumulator = 0, best = 0, activeGrip = null;
  const bestKey = 'ashutosh-web-swing-best-distance-v1';
  try { best = clamp(Number(localStorage.getItem(bestKey)) || 0, 0, 99999); } catch { /* Storage is optional. */ }
  const label = n => String(n).padStart(3, '0');
  function hud() {
    score.textContent = label(world.score);
    distance.textContent = `${Math.floor(world.distance)} m`;
    coins.textContent = String(world.collected.size).padStart(2, '0');
    timer.textContent = String(Math.ceil(30 - world.elapsed)).padStart(2, '0');
    hearts.textContent = '♥ '.repeat(world.hearts) + '♡ '.repeat(3 - world.hearts);
    hearts.setAttribute('aria-label', `${world.hearts} hearts remaining`);
    bestLabel.textContent = label(best);
    canvas.dataset.state = mode;
    canvas.dataset.web = world.anchor ? 'attached' : 'free';
    canvas.dataset.anchor = world.anchor ? String(world.anchor.id) : '';
    canvas.dataset.velocityX = world.player.vx.toFixed(1);
    canvas.dataset.positionX = world.player.x.toFixed(1);
  }
  function showOverlay(kicker, title, description, button) {
    dialog.querySelector('#game-overlay-kicker').textContent = kicker;
    dialog.querySelector('#game-overlay-title').textContent = title;
    dialog.querySelector('#game-overlay-description').textContent = description;
    start.textContent = button;
    overlay.hidden = false;
    hint.hidden = true;
  }
  function resize() {
    if (!dialog.open) return;
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    world.resize(r.width, r.height);
    draw();
  }
  function city(parallax, baseline, color, spacing, minimum) {
    ctx.fillStyle = color;
    const offset = world.camera * parallax, first = Math.floor(offset / spacing) - 1;
    for (let i = first; i < first + Math.ceil(world.width / spacing) + 3; i++) {
      const x = i * spacing - offset, height = minimum + (Math.sin(i * 19.13) + 1) * minimum * .6;
      ctx.fillRect(x, baseline - height, spacing - 5, height + world.height - baseline);
      ctx.fillStyle = '#a67a9328';
      for (let wy = baseline - height + 14; wy < baseline - 8; wy += 20) for (let wx = x + 9; wx < x + spacing - 9; wx += 15) {
        if ((i + Math.floor(wy / 20) + Math.floor(wx / 15)) % 3) ctx.fillRect(wx, wy, 3, 6);
      }
      ctx.fillStyle = color;
    }
  }
  function draw() {
    if (!ctx) return;
    const w = world.width, h = world.height, t = world.elapsed;
    const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#171326'); sky.addColorStop(.65, '#43223e'); sky.addColorStop(1, '#1a1424');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * .75, h * .43, 0, w * .75, h * .43, h * .7); glow.addColorStop(0, '#fd88941b'); glow.addColorStop(1, '#fd889400');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d8b6ce55';
    for (let i = 0; i < 24; i++) ctx.fillRect((i * 97.7 - world.camera * .025) % w, 17 + (i * 39.7) % (h * .48), 1, 1);
    ctx.strokeStyle = '#c18da626'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(w * .74, h * .35, 40, 0, Math.PI * 2); ctx.stroke();
    city(.14, h * .88, '#241c30', 65, 70);
    city(.3, h, '#1b1728', 80, 80);
    ctx.fillStyle = '#d59fa5'; ctx.globalAlpha = .35; ctx.font = '8px monospace'; ctx.fillText('MUMBAI / AFTER HOURS', 16, h - 15); ctx.globalAlpha = 1;
    const target = world.anchor || world.attachmentAnchor();
    for (const anchor of world.anchors()) {
      const x = anchor.x - world.camera;
      ctx.strokeStyle = '#bb91b033'; ctx.beginPath(); ctx.moveTo(x - 14, anchor.y); ctx.lineTo(x - 7, anchor.y); ctx.moveTo(x + 7, anchor.y); ctx.lineTo(x + 14, anchor.y); ctx.stroke();
      ctx.fillStyle = world.anchor && Math.abs(world.anchor.x - anchor.x) < 1 ? '#ff97aa' : '#a682aa';
      ctx.beginPath(); ctx.arc(x, anchor.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = anchor.id === target.id ? '#ffc2d0aa' : '#c698b72c'; ctx.beginPath(); ctx.arc(x, anchor.y, anchor.id === target.id ? 11 : 9, 0, Math.PI * 2); ctx.stroke();
    }
    for (const token of world.tokens()) {
      const x = token.x - world.camera, y = token.y;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.shadowColor = '#f6ba7b'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffd599'; ctx.fillRect(-4, -4, 8, 8); ctx.shadowBlur = 0; ctx.strokeStyle = '#ffd59944'; ctx.strokeRect(-8, -8, 16, 16); ctx.restore();
    }
    for (const drone of world.drones()) {
      const x = drone.x - world.camera, y = drone.y;
      ctx.fillStyle = '#2a1a37'; ctx.strokeStyle = '#d2668e'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x - 13, y - 5, 26, 11, 4); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 22, y - 10); ctx.lineTo(x - 7, y - 10); ctx.moveTo(x + 7, y - 10); ctx.lineTo(x + 22, y - 10); ctx.stroke();
      ctx.fillStyle = '#ff677f'; ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    const p = world.player, px = p.x - world.camera;
    if (world.anchor) {
      ctx.strokeStyle = '#f5d5e8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px + 4, p.y - 10); ctx.lineTo(world.anchor.x - world.camera, world.anchor.y); ctx.stroke();
    }
    ctx.save(); ctx.translate(px, p.y);
    ctx.rotate(clamp(Math.atan2(p.vy, Math.max(80, Math.abs(p.vx))) * .5, -.6, .65));
    if (p.vx < 0) ctx.scale(-1, 1);
    if (world.immune > 0 && Math.floor(t * 12) % 2) ctx.globalAlpha = .4;
    ctx.lineCap = 'round'; ctx.lineWidth = 4;
    ctx.strokeStyle = '#3764a0'; ctx.beginPath(); ctx.moveTo(-3, 8); ctx.lineTo(-12, 16); ctx.lineTo(-22, 11); ctx.moveTo(3, 8); ctx.lineTo(8, 20); ctx.lineTo(17, 19); ctx.stroke();
    ctx.fillStyle = '#315992'; ctx.beginPath(); ctx.ellipse(0, 5, 7, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ff6279'; ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(-14, 2); ctx.moveTo(4, -3); ctx.lineTo(world.anchor ? 7 : 15, world.anchor ? -16 : 0); ctx.stroke();
    ctx.fillStyle = '#f25a73'; ctx.beginPath(); ctx.ellipse(0, -9, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6d213c'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(0, 0); ctx.moveTo(-8, -9); ctx.lineTo(8, -9); ctx.stroke();
    ctx.fillStyle = '#fff3ec'; ctx.beginPath(); ctx.moveTo(-7, -12); ctx.lineTo(-1, -9); ctx.lineTo(-3, -6); ctx.lineTo(-6, -8); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(7, -12); ctx.lineTo(1, -9); ctx.lineTo(3, -6); ctx.lineTo(6, -8); ctx.closePath(); ctx.fill(); ctx.restore();
    if (world.anchor && p.y > h + 20) {
      ctx.fillStyle = '#f5d5e8'; ctx.font = '8px monospace'; ctx.textAlign = 'center';
      ctx.fillText('↓ WEB ATTACHED / BELOW GROUND', clamp(px, 120, w - 120), h - 12);
      ctx.textAlign = 'start';
    }
  }
  function stopLoop() { cancelAnimationFrame(frame); frame = 0; previous = 0; accumulator = 0; }
  function finish() {
    mode = 'finished'; stopLoop(); activeGrip = null; world.hold(false); pause.disabled = true;
    const newBest = world.score > best;
    best = Math.max(best, world.score);
    try { localStorage.setItem(bestKey, String(best)); } catch { /* No storage required to play. */ }
    showOverlay(newBest ? 'A NEW PERSONAL BEST' : 'NICE SWING / TRY ANOTHER ROUTE', world.hearts ? 'TIME WELL SWUNG.' : 'ONE MORE SWING?', `${Math.floor(world.distance)} m forward + ${world.collected.size} coins.\n${world.distanceScore} distance points + ${world.coinScore} coin points = ${world.score}. Best: ${best}.`, 'SWING AGAIN ↗');
    status.textContent = `Round finished. Score ${world.score}. ${newBest ? 'New personal best.' : ''}`;
    hud(); start.focus({ preventScroll: true });
  }
  function tick(time) {
    frame = 0;
    if (mode !== 'playing') return;
    accumulator += previous ? Math.min((time - previous) / 1000, .05) : 1 / 60; previous = time;
    while (accumulator >= 1 / 120 && !world.finished) { world.step(1 / 120); accumulator -= 1 / 120; }
    draw(); hud();
    if (world.finished) return finish();
    frame = requestAnimationFrame(tick);
  }
  function begin() {
    if (!ctx) return;
    const resuming = mode === 'paused';
    if (mode !== 'paused') { world.reset(); activeGrip = null; }
    mode = resuming ? 'playing' : 'ready'; overlay.hidden = true; hint.hidden = resuming; pause.disabled = !resuming; pause.textContent = 'PAUSE';
    status.textContent = resuming ? 'Round resumed. Press again to attach a web.' : 'Hold to attach one dot ahead of the nearest. Release to fly with your momentum. Press P to pause.';
    stopLoop(); hud(); draw(); canvas.focus({ preventScroll: true });
    if (resuming) frame = requestAnimationFrame(tick);
  }
  function firstSwing() {
    if (mode === 'ready') {
      mode = 'playing'; hint.hidden = true; pause.disabled = false;
      status.textContent = 'Round started. Earn one point per forward meter and ten per coin. Avoid drones.';
      frame = requestAnimationFrame(tick);
    }
  }
  function pauseGame() {
    if (mode !== 'playing') return;
    mode = 'paused'; activeGrip = null; world.hold(false); stopLoop(); hud();
    showOverlay('TAKE YOUR TIME', 'HANG TIGHT.', 'Your round is paused. Ready for the next rooftop?', 'KEEP SWINGING ↗');
    pause.textContent = 'RESUME'; status.textContent = 'Game paused.';
  }
  start.addEventListener('click', begin);
  pause.addEventListener('click', () => mode === 'playing' ? pauseGame() : begin());
  function grab(source) {
    if (!['ready', 'playing'].includes(mode) || activeGrip !== null) return;
    activeGrip = source;
    firstSwing(); world.hold(true); hud();
  }
  function release(source = null) {
    if (source !== null && source !== activeGrip) return;
    activeGrip = null; world.hold(false); hud();
  }
  canvas.addEventListener('pointerdown', event => {
    if (!['ready', 'playing'].includes(mode) || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault(); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId); grab(`pointer-${event.pointerId}`);
  });
  const releasePointer = event => release(`pointer-${event.pointerId}`);
  canvas.addEventListener('pointerup', releasePointer); canvas.addEventListener('pointercancel', releasePointer); canvas.addEventListener('lostpointercapture', releasePointer);
  canvas.addEventListener('keydown', event => {
    if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) grab('keyboard'); }
    if (event.key.toLowerCase() === 'p' && !event.repeat) { event.preventDefault(); mode === 'playing' ? pauseGame() : mode === 'paused' && begin(); }
  });
  canvas.addEventListener('keyup', event => { if (event.code === 'Space') { event.preventDefault(); release('keyboard'); } });
  canvas.addEventListener('blur', () => release());
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
  window.addEventListener('blur', pauseGame);
  new ResizeObserver(resize).observe(canvas);
  return {
    open() {
      mode = 'idle'; activeGrip = null; resize(); world.reset(); hud(); draw(); pause.disabled = true;
      showOverlay('30 SECONDS / THREE HEARTS', 'THE CITY IS YOURS.', 'Hold to attach one dot ahead of the nearest. Release to fly with momentum.\nScore 1 point per forward meter + 10 per coin.\nYour web keeps you safe below ground. A detached fall costs one heart.', 'LET’S SWING ↗');
      if (!ctx) { start.disabled = true; status.textContent = 'Canvas is unavailable in this browser.'; }
      start.focus({ preventScroll: true });
    },
    stop() { mode = 'idle'; release(); stopLoop(); hint.hidden = true; hud(); }
  };
}
