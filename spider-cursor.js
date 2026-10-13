const layer = document.querySelector('#cursor-spider');
const web = layer.querySelector('.cursor-web');
const thread = layer.querySelector('.cursor-web-thread');
const anchor = layer.querySelector('.cursor-web-anchor');
const spider = layer.querySelector('.cursor-spider-body');
const about = document.querySelector('#about');
const transitionWeb = document.querySelector('.transition-web');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const fullMotion = new URLSearchParams(location.search).get('motion') === 'full';
const point = { x: 0, y: 0 };
const body = { x: 0, y: 0, vx: 0, vy: 0, angle: 0 };
let width = innerWidth;
let height = innerHeight;
let frame = 0;
let previousTime = 0;
let lastMove = 0;
let lastShot = 0;
let ropeLength = 90;
let direction = 1;
let visible = false;
let hasPointer = false;
let birthTime = 0;
let activeArea = about.getBoundingClientRect().top <= height * .55;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const enabled = () => finePointer.matches && (fullMotion || !reducedMotion.matches) && !document.body.classList.contains('play-modal');

function stop(forgetPointer = false) {
  cancelAnimationFrame(frame);
  frame = 0;
  previousTime = 0;
  visible = false;
  layer.hidden = true;
  if (forgetPointer) hasPointer = false;
}
function facingAngle() {
  // The SVG's head points up, hence atan2(dx, -dy).
  return Math.atan2(point.x - body.x, body.y - point.y) * 180 / Math.PI;
}
function entryOrigin() {
  const matrix = transitionWeb.getScreenCTM();
  const origin = matrix ? new DOMPoint(800, 430).matrixTransform(matrix) : { x: width * .5, y: 0 };
  return { x: clamp(origin.x, 18, width - 18), y: clamp(origin.y, 18, height - 18) };
}
function beginChase(time) {
  const origin = entryOrigin();
  body.x = origin.x;
  body.y = origin.y;
  body.vx = body.vy = 0;
  body.angle = facingAngle();
  birthTime = lastMove = lastShot = time;
  ropeLength = clamp(Math.hypot(body.x - point.x, body.y - point.y), 44, 280);
  visible = true;
  layer.hidden = false;
  layer.dataset.origin = `${origin.x.toFixed(2)},${origin.y.toFixed(2)}`;
  render(time);
  if (!frame) frame = requestAnimationFrame(tick);
}
function setArea(active) {
  activeArea = active;
  if (!active) return stop();
  if (!visible && hasPointer && enabled() && !document.hidden) beginChase(performance.now());
}
function resize() {
  width = innerWidth;
  height = innerHeight;
  web.setAttribute('viewBox', `0 0 ${width} ${height}`);
  if (visible) {
    point.x = clamp(point.x, 0, width);
    point.y = clamp(point.y, 0, height);
    body.x = clamp(body.x, 18, width - 18);
    body.y = clamp(body.y, 18, height - 18);
  }
  setArea(about.getBoundingClientRect().top <= height * .55);
}
function render(time) {
  const dx = point.x - body.x;
  const dy = point.y - body.y;
  const distance = Math.hypot(dx, dy);
  const speed = Math.hypot(body.vx, body.vy);
  const shot = clamp((time - lastShot) / 100, 0, 1);
  const idle = time - lastMove;
  // A loose thread straightens as it reels in; its end stays at the cursor.
  const sag = Math.min(36, distance * .14) * (1 - shot * .7);
  thread.setAttribute('d', `M${body.x.toFixed(2)} ${body.y.toFixed(2)}Q${((body.x + point.x) / 2).toFixed(2)} ${((body.y + point.y) / 2 + sag).toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
  thread.style.strokeDashoffset = String(1 - shot);
  web.style.opacity = String(distance > 64 ? .65 : clamp((1450 - idle) / 700, 0, .65));
  anchor.setAttribute('cx', point.x);
  anchor.setAttribute('cy', point.y);
  anchor.style.opacity = String(shot);
  const entrance = clamp((time - birthTime) / 220, 0, 1);
  spider.style.opacity = String(entrance);
  spider.style.transform = `translate3d(${body.x.toFixed(2)}px, ${body.y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${body.angle.toFixed(2)}deg) scale(${(.6 + entrance * .4).toFixed(3)})`;
  spider.style.setProperty('--leg-flex', `${(Math.sin(time * .018) * Math.min(7, speed * .04)).toFixed(2)}deg`);
}
function tick(time) {
  frame = 0;
  if (!visible || !activeArea || !enabled() || document.hidden) return stop();
  const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .04) : 1 / 60;
  previousTime = time;
  // Small physics steps keep the tether stable after fast cursor movement.
  const steps = Math.ceil(elapsed / (1 / 120));
  const dt = elapsed / steps;
  for (let i = 0; i < steps; i++) {
    ropeLength = Math.max(38, ropeLength - 240 * dt);
    const dx = body.x - point.x;
    const dy = body.y - point.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const pull = Math.max(0, distance - ropeLength) * 90;
    const drag = Math.exp(-6 * dt);
    body.vx = clamp((body.vx - dx / distance * pull * dt) * drag, -700, 700);
    body.vy = clamp((body.vy + (500 - dy / distance * pull) * dt) * drag, -700, 700);
    body.x = clamp(body.x + body.vx * dt, 18, width - 18);
    body.y = clamp(body.y + body.vy * dt, 18, height - 18);
  }
  const turn = (facingAngle() - body.angle) * Math.PI / 180;
  const shortestTurn = Math.atan2(Math.sin(turn), Math.cos(turn)) * 180 / Math.PI;
  body.angle += shortestTurn * (1 - Math.exp(-18 * elapsed));
  const idle = time - lastMove;
  const nearCursor = Math.hypot(body.x - point.x, body.y - point.y) < 64;
  const speed = Math.hypot(body.vx, body.vy);
  if (idle > 1450 && nearCursor && (speed < 8 || (idle > 2400 && speed < 100))) {
    body.vx = body.vy = 0;
    render(time);
    web.style.opacity = '0';
    spider.style.setProperty('--leg-flex', '0deg');
    layer.dataset.state = 'settled';
    previousTime = 0;
    return;
  }
  render(time);
  layer.dataset.state = time - birthTime < 220 ? 'emerging' : 'swinging';
  frame = requestAnimationFrame(tick);
}
function chase(event) {
  if (event.pointerType !== 'mouse' || !enabled() || document.hidden) return;
  const time = performance.now();
  const movedX = event.clientX - point.x;
  const movedY = event.clientY - point.y;
  if (visible && Math.hypot(movedX, movedY) < .5) return;
  point.x = event.clientX;
  point.y = event.clientY;
  hasPointer = true;
  // Remember the cursor on Home without waking physics or painting the layer.
  if (!activeArea) return;
  lastMove = time;
  if (!visible) {
    beginChase(time);
  }
  if (time - lastShot > 180) {
    lastShot = time;
    const dx = body.x - point.x;
    const dy = body.y - point.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    ropeLength = clamp(distance, 44, 280);
    // Give each new web a tangential kick, so it swings instead of sliding.
    if (Math.abs(movedX) > 1) direction = Math.sign(movedX);
    body.vx += -dy / distance * 100 * direction;
    body.vy += dx / distance * 100 * direction;
  }
  if (!frame) frame = requestAnimationFrame(tick);
}
window.addEventListener('pointermove', chase, { passive: true });
document.addEventListener('portfolio:spider-area', event => setArea(event.detail.active));
document.addEventListener('portfolio:overlay', event => { if (event.detail.active) stop(); });
window.addEventListener('pointerout', event => { if (!event.relatedTarget) stop(true); });
window.addEventListener('blur', () => stop(true));
window.addEventListener('resize', resize, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(true); });
document.addEventListener('keydown', event => { if (event.key === 'Tab') stop(true); });
finePointer.addEventListener('change', () => stop(true));
reducedMotion.addEventListener('change', () => stop(true));
resize();
