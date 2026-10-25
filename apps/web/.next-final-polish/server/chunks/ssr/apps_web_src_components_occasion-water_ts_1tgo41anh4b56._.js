module.exports=[20812,a=>{"use strict";var b=a.i(82904);let c=`
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,d=`
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
`;async function e(a,e){if(e.aborted)return null;let f=a.getContext("webgl",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power",preserveDrawingBuffer:!1});if(!f)return null;let g=f.createProgram(),h=f.createBuffer();if(!g||!h)return f.deleteProgram(g),f.deleteBuffer(h),null;let i=f.getExtension("KHR_parallel_shader_compile"),j=[],k=!1;function l(){k||(k=!0,f.deleteBuffer(h),f.deleteProgram(g),j.forEach(a=>f.deleteShader(a)))}try{for(let[a,b]of[[f.VERTEX_SHADER,c],[f.FRAGMENT_SHADER,d]]){let c=f.createShader(a);if(!c)return l(),null;j.push(c),f.shaderSource(c,b),f.compileShader(c),f.attachShader(g,c)}if(f.bindAttribLocation(g,0,"position"),f.linkProgram(g),i){let a=performance.now()+2e3;for(;!f.getProgramParameter(g,i.COMPLETION_STATUS_KHR);){if(e.aborted||f.isContextLost()||performance.now()>a)return l(),null;await new Promise(a=>requestAnimationFrame(()=>a()))}}if(e.aborted||!f.getProgramParameter(g,f.LINK_STATUS))return l(),null;f.useProgram(g),f.bindBuffer(f.ARRAY_BUFFER,h),f.bufferData(f.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),f.STATIC_DRAW),f.enableVertexAttribArray(0),f.vertexAttribPointer(0,2,f.FLOAT,!1,0,0);let m=Object.fromEntries(["resolution","size","drop","water","effect"].map(a=>[a,f.getUniformLocation(g,a)])),n="",o=0,p=1,q=0,r=0;return{draw(c,d,g){if(k||e.aborted||f.isContextLost())return;let h=`${c.progress.toFixed(5)}:${d}:${g}:${p}`;if(h===n)return;n=h;let i=performance.now();q&&i-q<160&&i-q>36&&.04>Math.abs(c.progress-r)?o++:o=Math.max(0,o-1),o>=5&&1===p&&(p=.5),q=i,r=c.progress;let j=(0,b.b)(d,g,d<=700,p);(a.width!==j.width||a.height!==j.height)&&(a.width=j.width,a.height=j.height,f.viewport(0,0,j.width,j.height)),f.uniform2f(m.resolution,j.width,j.height),f.uniform2f(m.size,d,g),f.uniform4f(m.drop,c.dropY,c.radius,c.stretch,c.morph),f.uniform4f(m.water,c.surfaceY,c.stemTop,c.stemWidth,c.rippleAge),f.uniform4f(m.effect,c.waterOpacity,c.splash,c.handoff,c.progress),f.drawArrays(f.TRIANGLES,0,3)},dispose:l}}catch{return l(),null}}a.s(["createWaterRenderer",0,e])}];

//# sourceMappingURL=apps_web_src_components_occasion-water_ts_1tgo41anh4b56._.js.map