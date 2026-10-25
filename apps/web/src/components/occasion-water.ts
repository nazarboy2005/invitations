import { waterResolution, type WaterFrame } from "./occasion-water-motion";

// One triangle, one pass, no textures, simulations, render targets or 3D runtime.
const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform vec2 resolution;
uniform vec2 size;
uniform vec4 drop; // centre Y, radius, stretch, liquid-to-pomegranate
uniform vec4 water; // surface Y, stem top, stem width, ripple age
uniform vec4 effect; // water opacity, impact, HTML handoff, progress

vec3 environment(vec3 d) {
  float ceiling = smoothstep(-0.35, 0.65, d.y);
  vec3 c = mix(vec3(0.62, 0.47, 0.50), vec3(0.99, 0.97, 0.93), ceiling);
  // Broad studio windows and a restrained plum reflection, not a blue lake.
  float window = exp(-pow((d.x + 0.35) * 2.2, 2.0) - pow((d.y - 0.6) * 2.6, 2.0));
  c += vec3(0.30, 0.29, 0.27) * window;
  c -= vec3(0.08, 0.09, 0.08) * exp(-pow((d.y + 0.05) * 12.0, 2.0));
  return clamp(c, 0.0, 1.0);
}

float surfaceHeight(float r) {
  float age = water.w;
  float front = r - age * 2.5;
  float waves = sin(front * 6.5) * exp(-front * front * 0.6)
    * 0.095 * exp(-age * 0.45) * smoothstep(0.0, 0.12, age);
  float mound = exp(-r * r * 3.6) * (water.z * 0.016 - effect.y * 0.25);
  float calm = sin(r * 3.0) * exp(-r * 0.35) * 0.006 * (1.0 - smoothstep(0.0, 0.6, age));
  return waves + mound + calm;
}

vec3 glass(vec3 n, vec2 local) {
  vec3 reflected = environment(reflect(vec3(0.0, 0.0, -1.0), n));
  float rim = pow(1.0 - max(n.z, 0.0), 2.5);
  vec3 c = mix(vec3(0.92, 0.86, 0.82), reflected, 0.57);
  c = mix(c, vec3(0.42, 0.21, 0.27), rim * 0.62);
  float curvedBand = local.y + 0.10 * sin(local.x * 3.0);
  c -= vec3(0.15, 0.10, 0.11) * exp(-pow((curvedBand + 0.22) * 15.0, 2.0));
  c += vec3(0.12) * exp(-pow((curvedBand + 0.10) * 20.0, 2.0));
  c += vec3(0.42) * exp(-dot((local - vec2(-0.34, 0.45)) * vec2(4.0, 7.0),
    (local - vec2(-0.34, 0.45)) * vec2(4.0, 7.0)));
  return clamp(c, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = (uv - 0.5) * size;
  float aa = max(size.x / resolution.x, size.y / resolution.y) * 0.8;
  vec3 color = vec3(0.0);
  float alpha = 0.0;

  if (effect.x > 0.001) {
    vec3 ro = vec3(0.0, 3.0, 7.0);
    vec3 forward = normalize(vec3(0.0, -0.14, -1.0));
    vec3 up = normalize(vec3(0.0, 1.0, -0.14));
    vec2 screen = (uv * 2.0 - 1.0) * vec2(size.x / size.y, 1.0);
    vec3 rd = normalize(forward * 1.8 + vec3(screen.x, 0.0, 0.0) + up * screen.y);
    if (rd.y < -0.025) {
      float t = -ro.y / rd.y;
      vec3 q = ro + rd * t;
      float h = surfaceHeight(length(q.xz));
      q = ro + rd * ((h - ro.y) / rd.y);
      float r = length(q.xz);
      float slope = (surfaceHeight(r + 0.025) - surfaceHeight(max(0.0, r - 0.025))) / 0.05;
      vec3 n = normalize(vec3(-q.x / max(r, 0.001) * slope, 1.0, -q.z / max(r, 0.001) * slope));
      vec3 reflected = environment(reflect(rd, n));
      float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
      color = mix(vec3(0.86, 0.80, 0.76), reflected, 0.5 + fresnel * 0.4);
      vec3 light = normalize(vec3(-0.6, 1.0, 0.7));
      color += vec3(0.42, 0.38, 0.31) * pow(max(dot(n, normalize(light - rd)), 0.0), 65.0);
      float fog = 1.0 - smoothstep(7.0, 28.0, r);
      float poolEdge = 1.0 - smoothstep(2.6, 8.0, abs(q.x));
      alpha = fog * poolEdge * effect.x * 0.92;
    }

    // A softened, ripple-distorted reflection anchors the bulb to the water.
    float surfaceY = -water.x;
    if (p.y < surfaceY && drop.y > 1.0) {
      vec2 mirror = vec2(p.x + sin((p.y - surfaceY) * 0.07 - water.w * 4.0) * 2.0,
        p.y - (surfaceY * 2.0 + drop.x));
      mirror /= vec2(drop.y, drop.y * 0.7);
      float reflection = (1.0 - smoothstep(0.7, 1.2, length(mirror)))
        * exp((p.y - surfaceY) / (size.y * 0.16)) * effect.x * 0.17;
      color = mix(color, vec3(0.62, 0.44, 0.48), reflection);
    }

    // Analytic revolved neck: screen-space coverage, 3D cylindrical normals.
    // No ray-marching loop, including on phones.
    float stemBottom = -water.x;
    float stemTop = -water.y;
    float stemHeight = stemTop - stemBottom;
    if (water.z > 0.2 && stemHeight > 1.0 && p.y >= stemBottom - aa && p.y <= stemTop + aa) {
      float s = clamp((p.y - stemBottom) / stemHeight, 0.0, 1.0);
      float width = water.z * (0.55 + 1.9 * pow(1.0 - s, 5.0) + 0.4 * pow(s, 5.0));
      float coverage = (1.0 - smoothstep(width - aa, width + aa, abs(p.x)))
        * smoothstep(stemBottom - aa, stemBottom + aa, p.y);
      float nx = clamp(p.x / max(width, 0.1), -1.0, 1.0);
      vec3 n = normalize(vec3(nx, 0.10, sqrt(max(0.0, 1.0 - nx * nx))));
      vec3 c = glass(n, vec2(nx, s));
      color = mix(color * alpha, c, coverage);
      alpha = coverage + alpha * (1.0 - coverage);
      color /= max(alpha, 0.001);
    }
  }

  // The falling drop, rebound bulb and final orb are the same ellipsoid.
  if (drop.y > 0.15 && effect.z < 0.999) {
    vec2 local = (p - vec2(0.0, -drop.x)) / vec2(drop.y, drop.y * drop.z);
    float d = length(local);
    float coverage = (1.0 - smoothstep(1.0 - aa / drop.y, 1.0 + aa / drop.y, d)) * (1.0 - effect.z);
    if (coverage > 0.001) {
      vec3 n = normalize(vec3(local, sqrt(max(0.0, 1.0 - dot(local, local)))));
      vec3 c = glass(n, local);
      float highlight = exp(-dot(local - vec2(-0.3, 0.4), local - vec2(-0.3, 0.4)) * 2.8);
      vec3 wine = mix(vec3(0.62, 0.16, 0.26), vec3(0.79, 0.38, 0.45), highlight);
      c = mix(c, wine, drop.w);
      color = (color * alpha * (1.0 - coverage) + c * coverage);
      alpha = coverage + alpha * (1.0 - coverage);
      color /= max(alpha, 0.001);
    }
  }
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export type WaterRenderer = {
  draw(frame: WaterFrame, width: number, height: number): void;
  dispose(): void;
};

/** Called only near the section, after the hero, never for reduced motion. */
export async function createWaterRenderer(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Promise<WaterRenderer | null> {
  if (signal.aborted) return null;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!program || !buffer) {
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    return null;
  }
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  const shaders: WebGLShader[] = [];
  let closed = false;
  function dispose() {
    if (closed) return;
    closed = true;
    gl!.deleteBuffer(buffer);
    gl!.deleteProgram(program);
    shaders.forEach((shader) => gl!.deleteShader(shader));
  }
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) {
        dispose();
        return null;
      }
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, "position");
    gl.linkProgram(program);
    // Poll only while compiling; there is no permanent animation loop.
    if (parallel) {
      const deadline = performance.now() + 2000;
      while (!gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        if (
          signal.aborted ||
          gl.isContextLost() ||
          performance.now() > deadline
        ) {
          dispose();
          return null;
        }
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
      }
    }
    if (signal.aborted || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      dispose();
      return null;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(
      ["resolution", "size", "drop", "water", "effect"].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );
    let lastKey = "";
    let draws = 0;
    let slowFrames = 0;
    let budgetScale = 1;
    let lastDrawTime = 0;
    let lastProgress = 0;
    return {
      draw(state, width, height) {
        if (closed || signal.aborted || gl.isContextLost()) return;
        const key = `${state.progress.toFixed(5)}:${width}:${height}:${budgetScale}`;
        if (key === lastKey) return;
        lastKey = key;
        const now = performance.now();
        // If real scroll frames repeatedly arrive slowly, halve fill rate once.
        if (
          lastDrawTime &&
          now - lastDrawTime < 160 &&
          now - lastDrawTime > 36 &&
          Math.abs(state.progress - lastProgress) < 0.04
        )
          slowFrames++;
        else slowFrames = Math.max(0, slowFrames - 1);
        if (slowFrames >= 5 && budgetScale === 1) budgetScale = 0.5;
        lastDrawTime = now;
        lastProgress = state.progress;
        const pixels = waterResolution(
          width,
          height,
          width <= 700,
          budgetScale,
        );
        if (canvas.width !== pixels.width || canvas.height !== pixels.height) {
          canvas.width = pixels.width;
          canvas.height = pixels.height;
          gl.viewport(0, 0, pixels.width, pixels.height);
        }
        gl.uniform2f(uniforms.resolution, pixels.width, pixels.height);
        gl.uniform2f(uniforms.size, width, height);
        gl.uniform4f(
          uniforms.drop,
          state.dropY,
          state.radius,
          state.stretch,
          state.morph,
        );
        gl.uniform4f(
          uniforms.water,
          state.surfaceY,
          state.stemTop,
          state.stemWidth,
          state.rippleAge,
        );
        gl.uniform4f(
          uniforms.effect,
          state.waterOpacity,
          state.splash,
          state.handoff,
          state.progress,
        );
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (process.env.NODE_ENV === "development") {
          canvas.dataset.waterDraws = String(++draws);
          canvas.dataset.waterPixels = String(pixels.width * pixels.height);
        }
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
