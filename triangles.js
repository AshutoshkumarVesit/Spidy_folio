// A soft radius controls movement only. It never masks or removes the image.
export function segmentInfluence(point, from, to, radius) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const lengthSquared = dx * dx + dy * dy;
  const along = lengthSquared ? Math.max(0, Math.min(1,
    ((point[0] - from[0]) * dx + (point[1] - from[1]) * dy) / lengthSquared)) : 0;
  const distance = Math.hypot(point[0] - from[0] - dx * along, point[1] - from[1] - dy * along);
  const falloff = Math.max(0, 1 - distance / radius);
  return falloff * falloff * (3 - 2 * falloff);
}

// Each fragment is a textured triangle with its own spring, not a pixel filter.
export function createTriangleRenderer(gl, canvas, scene, front, back, pointer, reducedMotion) {
  const vertexSource = `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    attribute float a_alpha;
    varying vec2 v_uv;
    varying float v_alpha;
    void main() {
      v_uv = a_uv;
      v_alpha = a_alpha;
      gl_Position = vec4(a_position, 0., 1.);
    }`;
  const fragmentSource = `
    precision mediump float;
    varying vec2 v_uv;
    varying float v_alpha;
    uniform sampler2D u_image;
    uniform vec2 u_imageSize;
    uniform vec2 u_view;
    vec2 coverUV(vec2 uv) {
      float viewAspect = u_view.x / u_view.y;
      float imageAspect = u_imageSize.x / u_imageSize.y;
      vec2 scale = vec2(1.);
      if (viewAspect > imageAspect) scale.y = imageAspect / viewAspect;
      else scale.x = viewAspect / imageAspect;
      return (uv - .5) * scale + .5;
    }
    void main() {
      vec4 color = texture2D(u_image, coverUV(v_uv));
      gl_FragColor = vec4(color.rgb, color.a * v_alpha);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  const program = gl.createProgram();
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.useProgram(program);
  const uniform = name => gl.getUniformLocation(program, name);
  const imageUniform = uniform('u_image');
  const sizeUniform = uniform('u_imageSize');
  const viewUniform = uniform('u_view');
  const position = gl.getAttribLocation(program, 'a_position');
  const uv = gl.getAttribLocation(program, 'a_uv');
  const alpha = gl.getAttribLocation(program, 'a_alpha');
  [position, uv, alpha].forEach(index => gl.enableVertexAttribArray(index));

  function texture(image, unit) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  texture(front, 0);
  texture(back, 1);
  const backgroundBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,0,0,1, 1,-1,1,0,1, -1,1,0,1,1,
    -1,1,0,1,1, 1,-1,1,0,1, 1,1,1,1,1
  ]), gl.STATIC_DRAW);
  const triangleBuffer = gl.createBuffer();
  function bind(buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 20, 8);
    gl.vertexAttribPointer(alpha, 1, gl.FLOAT, false, 20, 16);
  }
  let shards = [], data, cssWidth = 0, cssHeight = 0;
  let lastTime = 0;
  let wasReduced = false;
  function build(width, height) {
    cssWidth = width;
    cssHeight = height;
    shards = [];
    const step = Math.max(16, Math.sqrt(width * height / 4500));
    const cols = Math.ceil(width / step), rows = Math.ceil(height / step);
    // Shared grid vertices prevent cracks in the assembled image. Alternate
    // diagonals and gently jitter inner vertices to avoid a square grid look.
    const points = [];
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const seed = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
        const jitter = (seed - Math.floor(seed) - .5) * .42;
        points.push([
          (col + (col > 0 && col < cols ? jitter : 0)) * width / cols,
          (row + (row > 0 && row < rows ? jitter : 0)) * height / rows
        ]);
      }
    }
    function triangle(a, b, c) {
      const points = [a, b, c];
      const cx = (a[0] + b[0] + c[0]) / 3;
      const cy = (a[1] + b[1] + c[1]) / 3;
      shards.push({points, cx, cy, seed: shards.length * 2.399963,
        x:0, y:0, vx:0, vy:0, angle:0, va:0, lift:0});
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * (cols + 1) + col;
        const a = points[index], b = points[index + 1];
        const c = points[index + cols + 1], d = points[index + cols + 2];
        if ((row + col) % 2) { triangle(a,b,c); triangle(b,d,c); }
        else { triangle(a,b,d); triangle(a,d,c); }
      }
    }
    data = new Float32Array(shards.length * 15);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
  }
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  return timestamp => {
    const width = scene.clientWidth, height = scene.clientHeight;
    const ratio = Math.max(1, Math.min(devicePixelRatio || 1, 2));
    const renderWidth = Math.round(width * ratio), renderHeight = Math.round(height * ratio);
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      gl.viewport(0, 0, renderWidth, renderHeight);
    }
    const dt = Math.max(.001, Math.min((timestamp - lastTime) / 1000, .025));
    lastTime = timestamp;
    gl.uniform2f(viewUniform, width, height);
    bind(backgroundBuffer);
    // The transparent portrait sits above the city, behind the assembled
    // foreground mesh. Only gaps BETWEEN shifted pieces expose the portrait.
    gl.uniform1i(imageUniform, 0);
    gl.uniform2f(sizeUniform, front.naturalWidth, front.naturalHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (reducedMotion.matches) {
      pointer.segments.length = 0;
      if (!wasReduced) for (const shard of shards) {
        shard.x = shard.y = shard.angle = shard.lift = shard.vx = shard.vy = shard.va = 0;
      }
      wasReduced = true;
      return;
    }
    wasReduced = false;
    gl.uniform1i(imageUniform, 1);
    gl.uniform2f(sizeUniform, back.naturalWidth, back.naturalHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    const radius = Math.min(150, Math.min(width, height) * .18);
    if (width !== cssWidth || height !== cssHeight) build(width, height);
    const segments = pointer.segments.splice(0).map(segment => {
      const from = [segment.from.x * width, segment.from.y * height];
      const to = [segment.to.x * width, segment.to.y * height];
      const dx = to[0] - from[0], dy = to[1] - from[1];
      const length = Math.hypot(dx, dy);
      return { from, to, length, nx: dx / (length || 1), ny: dy / (length || 1),
        minX: Math.min(from[0], to[0]), maxX: Math.max(from[0], to[0]),
        minY: Math.min(from[1], to[1]), maxY: Math.max(from[1], to[1]) };
    }).filter(segment => segment.length > .05);

    let offset = 0;
    for (const shard of shards) {
      for (const segment of segments) {
        if (shard.cx < segment.minX - radius || shard.cx > segment.maxX + radius ||
            shard.cy < segment.minY - radius || shard.cy > segment.maxY + radius) continue;
        const influence = segmentInfluence([shard.cx, shard.cy], segment.from, segment.to, radius);
        if (!influence) continue;
        // Move along the cursor with varied flutter, instead of pushing every
        // piece outwards until a circular hole is cleared.
        const kick = (100 + Math.min(1, segment.length / 24) * 140) * influence;
        const flutter = Math.sin(shard.seed) * 70 * influence;
        shard.vx = Math.max(-500, Math.min(500, shard.vx + segment.nx * kick - segment.ny * flutter));
        shard.vy = Math.max(-500, Math.min(500, shard.vy + segment.ny * kick + segment.nx * flutter));
        shard.va = Math.max(-9, Math.min(9, shard.va + Math.sin(shard.seed) * 6 * influence));
        shard.lift = Math.max(shard.lift, influence);
        break;
      }
      // No input means no new force: only the return springs keep running.
      shard.vx += (-shard.x * 85 - shard.vx * 15) * dt;
      shard.vy += (-shard.y * 85 - shard.vy * 15) * dt;
      shard.va += (-shard.angle * 70 - shard.va * 14) * dt;
      shard.x = Math.max(-32, Math.min(32, shard.x + shard.vx * dt));
      shard.y = Math.max(-32, Math.min(32, shard.y + shard.vy * dt));
      shard.angle += shard.va * dt;
      shard.lift *= Math.exp(-dt * 8);
      if (Math.abs(shard.x) + Math.abs(shard.y) + Math.abs(shard.vx) + Math.abs(shard.vy) + Math.abs(shard.angle) + Math.abs(shard.va) < .001) {
        shard.x = shard.y = shard.vx = shard.vy = shard.angle = shard.va = 0;
      }
      const cos = Math.cos(shard.angle), sin = Math.sin(shard.angle);
      const scale = 1 - shard.lift * .03;
      for (const point of shard.points) {
        const localX = (point[0] - shard.cx) * scale;
        const localY = (point[1] - shard.cy) * scale;
        const x = shard.cx + localX * cos - localY * sin + shard.x;
        const y = shard.cy + localX * sin + localY * cos + shard.y;
        data[offset++] = x / width * 2 - 1;
        data[offset++] = y / height * 2 - 1;
        data[offset++] = point[0] / width;
        data[offset++] = point[1] / height;
        data[offset++] = 1;
      }
    }
    gl.uniform1i(imageUniform, 0);
    gl.uniform2f(sizeUniform, front.naturalWidth, front.naturalHeight);
    bind(triangleBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.drawArrays(gl.TRIANGLES, 0, data.length / 5);
  };
}
