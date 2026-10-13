// Deterministic world and fixed-step rope physics, independent of DOM/rendering.
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const anchorBands = [2, 0, 3, 1];
const coinBands = [0, 2, 1, 3];
const bandAt = (bands, id) => bands[((id % bands.length) + bands.length) % bands.length];
const pixelsPerMeter = 10;
export const coinPoints = 10;
export class SwingWorld {
  constructor(width = 960, height = 480) { this.width = width; this.height = height; this.reset(); }
  reset() {
    this.player = { x: 65, y: this.height * .43, vx: 185, vy: -25 };
    this.startX = this.player.x; this.farthestX = this.startX;
    this.camera = this.player.x - this.width * .3; this.elapsed = 0; this.hearts = 3;
    this.anchor = null; this.rope = 0; this.held = false; this.immune = 0;
    this.collected = new Set(); this.finished = false; this.lastHit = false;
  }
  get distance() { return Math.max(0, (this.farthestX - this.startX) / pixelsPerMeter); }
  get distanceScore() { return Math.floor(this.distance); }
  get coinScore() { return this.collected.size * coinPoints; }
  get score() { return this.distanceScore + this.coinScore; }
  resize(width, height) {
    const scale = height / this.height;
    this.player.y *= scale;
    if (this.anchor) {
      this.anchor.y *= scale;
      this.rope = Math.hypot(this.player.x - this.anchor.x, this.player.y - this.anchor.y);
    }
    this.width = width; this.height = height;
  }
  anchorAt(id) {
    return { id, x: 140 + id * 160, y: this.height * (.14 + bandAt(anchorBands, id) * .2) };
  }
  anchors() {
    const first = Math.floor(this.camera / 160) - 1;
    return Array.from({ length: Math.ceil(this.width / 160) + 4 }, (_, j) => this.anchorAt(first + j));
  }
  nearestAnchor() {
    const center = Math.round((this.player.x - 140) / 160);
    const candidates = Array.from({ length: 5 }, (_, i) => this.anchorAt(center + i - 2));
    return candidates.reduce((nearest, dot) => Math.hypot(dot.x - this.player.x, dot.y - this.player.y) < Math.hypot(nearest.x - this.player.x, nearest.y - this.player.y) ? dot : nearest);
  }
  attachmentAnchor() {
    return this.anchorAt(this.nearestAnchor().id + 1);
  }
  tokens() {
    const first = Math.max(0, Math.floor(this.camera / 135) - 1);
    return Array.from({ length: Math.ceil(this.width / 135) + 4 }, (_, j) => {
      const i = first + j;
      return { id: i, x: 155 + i * 135, y: this.height * (.18 + bandAt(coinBands, i) * .2) };
    }).filter(token => !this.collected.has(token.id));
  }
  drones() {
    const first = Math.max(0, Math.floor(this.camera / 540) - 1);
    return Array.from({ length: Math.ceil(this.width / 540) + 3 }, (_, j) => {
      const i = first + j;
      return { x: 620 + i * 540, y: this.height * .48 + Math.sin(this.elapsed * 1.8 + i) * 50 };
    });
  }
  attach() {
    this.anchor = this.attachmentAnchor();
    this.rope = Math.max(1, Math.hypot(this.player.x - this.anchor.x, this.player.y - this.anchor.y));
  }
  hold(value) {
    if (value === this.held || value && this.finished) return;
    this.held = value;
    if (value) this.attach();
    else this.anchor = null;
  }
  hit(cause = 'drone') {
    if (this.immune > 0 && cause !== 'ground') return;
    this.hearts--; this.lastHit = true; this.immune = 1.5;
    this.player.y = this.height * .36; this.player.vy = -150; this.player.vx = 185;
    // A collision breaks the web; a fresh user press is needed to attach again.
    this.anchor = null; this.held = false;
    if (this.hearts <= 0) this.finished = true;
  }
  step(dt) {
    if (this.finished) return;
    this.lastHit = false;
    dt = Math.min(dt, 1 / 60);
    this.elapsed = Math.min(30, this.elapsed + dt);
    this.immune = Math.max(0, this.immune - dt);
    const p = this.player;
    p.vy += 660 * dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (this.anchor) {
      const dx = p.x - this.anchor.x, dy = p.y - this.anchor.y;
      const distance = Math.hypot(dx, dy);
      if (distance > this.rope) {
        const nx = dx / distance, ny = dy / distance;
        p.x = this.anchor.x + nx * this.rope; p.y = this.anchor.y + ny * this.rope;
        const outward = p.vx * nx + p.vy * ny;
        if (outward > 0) { p.vx -= outward * nx; p.vy -= outward * ny; }
      }
    }
    if (p.y < 25) { p.y = 25; p.vy = Math.max(20, p.vy); }
    // A held web supports swings below the ground; only detached falls respawn.
    if (!this.anchor && p.y > this.height - 26) this.hit('ground');
    // Follow both directions; the camera must not strand a backward swing.
    const cameraTarget = p.x - this.width * .3;
    this.camera += (cameraTarget - this.camera) * (1 - Math.exp(-7 * dt));
    // Only new forward ground earns distance points; backtracking cannot farm them.
    this.farthestX = Math.max(this.farthestX, p.x);
    for (const token of this.tokens()) {
      if (Math.hypot(p.x - token.x, p.y - token.y) < 27) this.collected.add(token.id);
    }
    for (const drone of this.drones()) {
      if (Math.hypot(p.x - drone.x, p.y - drone.y) < 27) this.hit();
    }
    if (this.elapsed >= 30) this.finished = true;
  }
}
