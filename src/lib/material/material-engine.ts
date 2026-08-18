/**
 * MaterialEngine — a WebGL "digital sculpture" backdrop.
 *
 * Renders a warm paper-like material sheet whose surface is a procedural
 * height field (domain-warped fbm relief, embossed flower shapes, and
 * deferred local deformations), lit by one soft virtual light that drifts
 * slowly after the pointer. All motion is intentionally slow and inertial:
 * the goal is a quiet, tactile, slowly-breathing material — not a flashy
 * cursor effect.
 *
 * If WebGL is unavailable the caller (MaterialBackground) falls back to a
 * static CSS paper sheet.
 */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_light;        // aspect-corrected, normalized 0..1
uniform vec4 u_flowers[8];   // x, y (aspect-corrected), radius, amplitude
uniform int u_flowerCount;
uniform vec4 u_deforms[8];   // x, y (aspect-corrected), strength, radius
uniform int u_deformCount;
uniform vec4 u_trail[8];     // x, y, glow strength, glow radius
uniform int u_trailCount;

varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm2(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 2; i++) {
    v += amp * vnoise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return v;
}

float fbm3(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    v += amp * vnoise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return v;
}

// Domain-warped base relief: gentle, continuous, organic undulation.
float relief(vec2 p) {
  vec2 q = vec2(fbm2(p + vec2(0.0, 0.0)), fbm2(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm2(p + 4.0 * q + vec2(1.7, 9.2)), fbm2(p + 4.0 * q + vec2(8.3, 2.8)));
  return fbm3(p + 4.0 * r);
}

// Embossed flower shapes: raised petals with a clearly pressed centre.
// Written as a fixed-iteration loop with a mask — no break/continue — for
// maximum GLSL ES 1.00 driver compatibility.
float flowerSum(vec2 p) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    float active = float(i < u_flowerCount);
    vec4 f = u_flowers[i];
    vec2 d = p - f.xy;
    float dist = length(d);
    float t = clamp(dist / max(f.z, 0.0001), 0.0, 1.0);
    float fall = 1.0 - t * t;
    fall *= fall;
    float center = 1.0 - smoothstep(0.0, 0.38, t);
    float c = d.x / max(dist, 0.0001);
    float c3 = 4.0 * c * c * c - 3.0 * c;   // cos(3 * theta)
    float petals = c3 * c3;                 // cos^2(3 * theta): six lobes
    float ring = petals * fall * (1.0 - center) * 1.0;
    float dip = -0.42 * center * fall;
    s += (ring + dip) * f.w * active;
  }
  return s;
}

// Local deformations (soft bulges / presses) with fully soft falloff.
float deformSum(vec2 p) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 d = u_deforms[i];
    float active = float(i < u_deformCount) * step(0.0001, abs(d.z));
    float dist = length(p - d.xy);
    float t = clamp(dist / max(d.w, 0.0001), 0.0, 1.0);
    float fall = 1.0 - t * t;
    fall *= fall;
    s += d.z * fall * active;
  }
  return s;
}

// Cursor trail: several ghost light spots lagging behind the pointer, so a
// mouse sweep leaves a visible band of warm light across the sheet.
float trailGlow(vec2 p) {
  float g = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 t = u_trail[i];
    float active = float(i < u_trailCount) * step(0.0001, t.z);
    float d2 = dot(p - t.xy, p - t.xy);
    float r2 = t.w * t.w;
    float fall = 1.0 - d2 / max(r2, 0.0001);
    fall = clamp(fall, 0.0, 1.0);
    g += fall * fall * t.z * active;
  }
  return g;
}

float heightAt(vec2 p) {
  float h = (relief(p) - 0.5) * 0.065;
  h += flowerSum(p) * 0.20;
  h += deformSum(p);
  // Extremely slow "breathing" so the material never feels frozen.
  h += sin(u_time * 0.09 + p.y * 5.0 + p.x * 3.0) * 0.0018;
  return h;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float eps = 1.6 / u_resolution.y;
  float h = heightAt(p);
  float hx = heightAt(p + vec2(eps, 0.0));
  float hy = heightAt(p + vec2(0.0, eps));
  vec3 N = normalize(vec3((h - hx) * 300.0, (h - hy) * 300.0, 1.0));

  // Virtual light: direction tilts with distance so relief shading stays alive.
  vec2 lv = u_light - p;
  float ld = length(lv);
  vec3 L = normalize(vec3(lv, 0.5 + ld * 0.18));
  float diff = max(dot(N, L), 0.0);
  float lightAmt = clamp(0.28 + diff * 0.72, 0.0, 1.0);

  vec3 lit = vec3(0.966, 0.934, 0.838); // warm cream highlight
  vec3 shd = vec3(0.660, 0.602, 0.490); // low-contrast grey-tan shadow
  vec3 gold = vec3(0.87, 0.72, 0.40);

  vec3 col = mix(shd, lit, lightAmt);

  // Soft light pool: the sheet brightens subtly toward the virtual light,
  // giving the pointer movement a clearly readable (but gentle) response.
  float pool = 1.0 - smoothstep(0.0, 1.15, length(lv));
  col *= 0.930 + pool * 0.16;

  // Cursor trail light: ghost spots warm and lift the paper near the pointer.
  float glow = trailGlow(p);
  col = mix(col, vec3(0.995, 0.975, 0.915), glow * 1.0);
  col = mix(col, gold, glow * 0.10);

  // Raised areas catch a touch more warm light; pressed areas sink darker.
  float raised = smoothstep(0.004, 0.02, h);
  col = mix(col, lit, raised * 0.16);
  float pressed = smoothstep(0.0, 0.02, -h);
  col *= 1.0 - pressed * 0.16;

  // Embossed flowers: petals lift toward the light, with a clear golden
  // sheen along their raised edges so the flower forms read clearly.
  float fs = flowerSum(p);
  float fmask = clamp(fs * 2.6, 0.0, 1.0);
  col = mix(col, lit, fmask * 0.24);
  col = mix(col, gold, fmask * 0.20);

  // Engraved petal outline: a fine golden line traces the flower silhouette,
  // so the blossoms read even when the pointer is far away. A wider
  // difference step keeps the line on the true edge, not the whole petal.
  float ed = eps * 10.0;
  float fsx = flowerSum(p + vec2(ed, 0.0));
  float fsy = flowerSum(p + vec2(0.0, ed));
  float fg = length(vec2(fs - fsx, fs - fsy)) / ed;
  float petalEdge = smoothstep(1.8, 4.5, fg);
  col = mix(col, gold, petalEdge * 0.65);
  col = mix(col, lit, petalEdge * 0.14);

  // Soft sheen on the highest points of the relief.
  vec3 R = reflect(-L, N);
  float spec = pow(max(R.z, 0.0), 22.0);
  col += lit * spec * 0.06;

  // Paper grain: static, very fine, plus broad mottle. No visible animation.
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.022;
  col += (hash(gl_FragCoord.xy * 3.31 + 17.7) - 0.5) * 0.013;
  col += (fbm3(p * 18.0) - 0.5) * 0.055;

  // Gentle vignette.
  float vd = length((uv - 0.5) * vec2(1.0, 0.9));
  col *= 0.955 + 0.045 * smoothstep(0.70, 0.32, vd);

  gl_FragColor = vec4(col, 1.0);
}
`;

const MAX_DEFORMS = 8;

/** Flower positions are in normalized viewport space (0..1, y-down). */
const FLOWER_DEFS = [
  { x: 0.14, y: 0.18, r: 0.30, a: 1.0 },
  { x: 0.86, y: 0.26, r: 0.34, a: 0.8 },
  { x: 0.50, y: 0.56, r: 0.28, a: 0.95 },
  { x: 0.10, y: 0.82, r: 0.36, a: 0.7 },
  { x: 0.90, y: 0.80, r: 0.30, a: 0.85 },
  { x: 0.38, y: 0.98, r: 0.26, a: 0.6 },
] as const;

type DeformSlot = {
  x: number;
  y: number;
  r: number;
  target: number;
  cur: number;
  lastUse: number;
};

export class MaterialEngine {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniformLocs = new Map<string, WebGLUniformLocation>();
  private raf = 0;
  private disposed = false;
  private lastDt = -1;
  private width = 1;
  private height = 1;
  private aspect = 1;
  private flowers = new Float32Array(MAX_DEFORMS * 4);
  private deforms = new Float32Array(MAX_DEFORMS * 4);
  private trailData = new Float32Array(MAX_DEFORMS * 4);
  private slots: (DeformSlot | undefined)[] = [];
  private light = { x: 0.5, y: 0.44 };
  private lightTarget = { x: 0.5, y: 0.44 };
  private lastPointerT = -Infinity;
  /** Ghost light spots lagging behind the pointer (trail[0] = newest). */
  private trail: { x: number; y: number }[] = Array.from(
    { length: MAX_DEFORMS },
    () => ({ x: 0.5, y: 0.44 }),
  );

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL is not available");
    this.gl = gl;

    this.program = this.buildProgram();
    this.setupGeometry();
    this.cacheUniforms();

    // Slot 0 is reserved for the pointer's own subtle bulge.
    const hover = this.makeSlot();
    hover.target = 0;
    this.slots.push(hover);

    this.resize();
    this.bindEvents();

    // Always run the loop so pointer interaction works; under
    // prefers-reduced-motion we disable autonomous motion (idle drift,
    // breathing) but keep the pointer-driven light and press responses —
    // those are interaction, not decoration.
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Push a local bulge (strength > 0) or release one (strength = 0) at a client position. */
  pressAt(clientX: number, clientY: number, radiusPx: number, strength: number): number {
    const x = (clientX / window.innerWidth) * this.aspect;
    const y = clientY / window.innerHeight;
    const r = Math.max(radiusPx / window.innerHeight, 0.02);

    let idx = -1;
    for (let i = 1; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (!s) continue;
      if (Math.abs(s.x - x) < 0.09 && Math.abs(s.y - y) < 0.09) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      if (Math.abs(strength) < 0.0001) return -1;
      idx = this.claimSlot();
    }
    const s = this.slots[idx];
    if (!s) return -1;
    s.x = x;
    s.y = y;
    s.r = r;
    s.target = strength;
    s.lastUse = performance.now();
    return idx;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerMove);
    document.removeEventListener("pointerleave", this.onPointerLeave);
    // NOTE: do NOT call WEBGL_lose_context here. Losing the context makes the
    // canvas permanently dead; if React remounts the same canvas (StrictMode
    // double-mount, HMR, route re-entry) every GL call silently no-ops and the
    // background collapses to a flat color. Let GC reclaim the context instead.
  }

  // ── internals ────────────────────────────────────────────────────────────

  private frame = (now: number) => {
    if (this.disposed) return;
    this.renderFrame(now / 1000);
    this.raf = requestAnimationFrame(this.frame);
  };

  private renderFrame(t: number) {
    const gl = this.gl;
    const dt = this.lastDt < 0 ? 0.016 : Math.min(t - this.lastDt, 0.05);
    this.lastDt = t;
    const reduced = this.prefersReducedMotion();

    // When the pointer rests, the light drifts on its own, extremely slowly.
    // (Not under prefers-reduced-motion — no autonomous motion.)
    if (!reduced && performance.now() - this.lastPointerT > 4000) {
      this.lightTarget.x = 0.5 + Math.sin(t * 0.06) * 0.08;
      this.lightTarget.y = 0.44 + Math.cos(t * 0.05) * 0.06;
      const hover = this.slots[0];
      if (hover) hover.target = 0;
    }

    const kLight = 1 - Math.exp(-dt * 1.6);
    const kDeform = 1 - Math.exp(-dt * 2.0);
    this.light.x += (this.lightTarget.x - this.light.x) * kLight;
    this.light.y += (this.lightTarget.y - this.light.y) * kLight;

    // Cursor trail: newest spot chases the light fast, older ones lag with
    // increasing inertia so a sweep leaves a fading band of warmth.
    const kTrail0 = 1 - Math.exp(-dt * 7.0);
    const kTrailN = 1 - Math.exp(-dt * 3.2);
    // Fade the glow out while the pointer rests, so movement reads clearly.
    const idleMs = performance.now() - this.lastPointerT;
    const idleFade = reduced ? 0 : Math.max(0, 1 - idleMs / 10000);
    let prevX = this.light.x;
    let prevY = this.light.y;
    for (let i = 0; i < MAX_DEFORMS; i++) {
      const p = this.trail[i]!;
      const k = i === 0 ? kTrail0 : kTrailN;
      p.x += (prevX - p.x) * k;
      p.y += (prevY - p.y) * k;
      prevX = p.x;
      prevY = p.y;
      // strength decays with age; radius grows so older ghosts are wider+weaker
      const age = i / Math.max(MAX_DEFORMS - 1, 1);
      this.trailData[i * 4] = p.x * this.aspect;
      this.trailData[i * 4 + 1] = p.y;
      this.trailData[i * 4 + 2] = (1.6 - age * 0.9) * idleFade;
      this.trailData[i * 4 + 3] = 0.22 + age * 0.40;
    }

    let count = 0;
    for (let i = 0; i < this.slots.length && count < MAX_DEFORMS; i++) {
      const s = this.slots[i];
      if (!s) continue;
      s.cur += (s.target - s.cur) * kDeform;
      if (Math.abs(s.cur) < 0.0004 && Math.abs(s.target) < 0.0004) {
        s.cur = 0;
        continue;
      }
      this.deforms[count * 4] = s.x;
      this.deforms[count * 4 + 1] = s.y;
      this.deforms[count * 4 + 2] = s.cur;
      this.deforms[count * 4 + 3] = s.r;
      count++;
    }

    gl.useProgram(this.program);
    gl.uniform2f(this.requireUniform("u_resolution"), this.width, this.height);
    // Freeze the breathing term under prefers-reduced-motion.
    gl.uniform1f(this.requireUniform("u_time"), reduced ? 0.6 : t);
    gl.uniform2f(
      this.requireUniform("u_light"),
      this.light.x * this.aspect,
      this.light.y,
    );
    gl.uniform4fv(this.requireUniform("u_flowers"), this.flowers);
    gl.uniform1i(this.requireUniform("u_flowerCount"), FLOWER_DEFS.length);
    gl.uniform4fv(this.requireUniform("u_deforms"), this.deforms);
    gl.uniform1i(this.requireUniform("u_deformCount"), count);
    gl.uniform4fv(this.requireUniform("u_trail"), this.trailData);
    gl.uniform1i(this.requireUniform("u_trailCount"), MAX_DEFORMS);
    gl.viewport(0, 0, this.width, this.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private buildProgram(): WebGLProgram {
    const gl = this.gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    const prog = gl.createProgram();
    if (!prog) throw new Error("Failed to create shader program");
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(`Shader link failed: ${log}`);
    }
    return prog;
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${log}`);
    }
    return shader;
  }

  private setupGeometry() {
    const gl = this.gl;
    // One big triangle covering the clip space.
    const buf = gl.createBuffer();
    if (!buf) throw new Error("Failed to create vertex buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(this.program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  private cacheUniforms() {
    const gl = this.gl;
    const names = [
      "u_resolution",
      "u_time",
      "u_light",
      "u_flowers",
      "u_flowerCount",
      "u_deforms",
      "u_deformCount",
      "u_trail",
      "u_trailCount",
    ] as const;
    for (const name of names) {
      const loc = gl.getUniformLocation(this.program, name);
      if (loc) this.uniformLocs.set(name, loc);
    }
  }

  private requireUniform(name: string): WebGLUniformLocation {
    const loc = this.uniformLocs.get(name);
    if (!loc) throw new Error(`Uniform not found: ${name}`);
    return loc;
  }

  private refreshFlowers() {
    for (let i = 0; i < MAX_DEFORMS; i++) {
      const def = FLOWER_DEFS[i];
      const off = i * 4;
      if (def) {
        this.flowers[off] = def.x * this.aspect;
        this.flowers[off + 1] = def.y;
        this.flowers[off + 2] = def.r;
        this.flowers[off + 3] = def.a;
      } else {
        this.flowers[off] = 0;
        this.flowers[off + 1] = 0;
        this.flowers[off + 2] = 0.1;
        this.flowers[off + 3] = 0;
      }
    }
  }

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let w = Math.max(1, Math.round(window.innerWidth * dpr));
    let h = Math.max(1, Math.round(window.innerHeight * dpr));
    const area = w * h;
    if (area > 2_400_000) {
      const k = Math.sqrt(2_400_000 / area);
      w = Math.round(w * k);
      h = Math.round(h * k);
    }
    this.width = w;
    this.height = h;
    this.aspect = w / h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.refreshFlowers();
  };

  private onPointerMove = (e: PointerEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    this.lightTarget.x = x;
    this.lightTarget.y = y;
    this.lastPointerT = performance.now();
    const hover = this.slots[0];
    if (hover) {
      hover.x = x * this.aspect;
      hover.y = y;
      hover.r = 0.34;
      hover.target = 0.040;
      hover.lastUse = performance.now();
    }
  };

  private onPointerLeave = () => {
    this.lastPointerT = -Infinity;
    this.lightTarget.x = 0.5;
    this.lightTarget.y = 0.44;
  };

  private bindEvents() {
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerMove, { passive: true });
    document.addEventListener("pointerleave", this.onPointerLeave);
  }

  private makeSlot(): DeformSlot {
    return { x: 0.5, y: 0.5, r: 0.2, target: 0, cur: 0, lastUse: -Infinity };
  }

  private claimSlot(): number {
    for (let i = 1; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s && Math.abs(s.target) < 0.0001 && Math.abs(s.cur) < 0.0001) return i;
    }
    if (this.slots.length < MAX_DEFORMS) {
      this.slots.push(this.makeSlot());
      return this.slots.length - 1;
    }
    let oldest = 1;
    let t = Infinity;
    for (let i = 1; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s && s.lastUse < t) {
        t = s.lastUse;
        oldest = i;
      }
    }
    return oldest;
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
}
