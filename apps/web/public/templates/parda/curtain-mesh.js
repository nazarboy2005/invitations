(function () {
  "use strict";
  var COLS = 70, ROWS = 30;
  function shader(gl, type, source) {
    var s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }
  function create(canvas) {
    if (!canvas) return null;
    var gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return null;
    var vs = "attribute vec3 aPosition;attribute vec3 aNormal;attribute vec2 aUv;varying vec3 vNormal;varying vec2 vUv;varying float vPleat;uniform vec2 uSize;void main(){vec2 p=vec2(aPosition.x/uSize.x*2.0-1.0,1.0-aPosition.y/uSize.y*2.0);gl_Position=vec4(p,aPosition.z,1.0);vNormal=normalize(aNormal);vUv=aUv;vPleat=abs(aNormal.x);} ";
    var fs = "precision mediump float;varying vec3 vNormal;varying vec2 vUv;varying float vPleat;uniform sampler2D uFabric;uniform sampler2D uMask;uniform float uBack;uniform float uProgress;uniform float uHasMask;void main(){vec4 tex=texture2D(uFabric,vUv);float coverage=texture2D(uMask,vUv).r*uHasMask;vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-0.42,0.62,0.66));float diffuse=max(0.0,dot(n,light));float valley=0.74+0.26*smoothstep(0.0,0.85,vPleat);float sheen=coverage*pow(max(0.0,dot(reflect(-light,n),vec3(0.0,0.0,1.0))),14.0)*0.22;vec3 warm=vec3(1.0,0.49,0.22)*(1.0-coverage)*uBack*0.42;float rim=pow(1.0-abs(n.z),2.4)*0.14;vec3 color=tex.rgb*(0.48+0.58*diffuse)*valley+warm+vec3(0.98,0.73,0.38)*(sheen+rim);gl_FragColor=vec4(color,tex.a);} ";
    var vsh = shader(gl, gl.VERTEX_SHADER, vs), fsh = shader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vsh || !fsh) return null;
    var program = gl.createProgram(); gl.attachShader(program, vsh); gl.attachShader(program, fsh); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    var attrs = { pos: gl.getAttribLocation(program, "aPosition"), normal: gl.getAttribLocation(program, "aNormal"), uv: gl.getAttribLocation(program, "aUv") };
    var uniforms = { size: gl.getUniformLocation(program, "uSize"), fabric: gl.getUniformLocation(program, "uFabric"), mask: gl.getUniformLocation(program, "uMask"), back: gl.getUniformLocation(program, "uBack"), progress: gl.getUniformLocation(program, "uProgress"), hasMask: gl.getUniformLocation(program, "uHasMask") };
    var vertexCount = 2 * (COLS + 1) * (ROWS + 1), positions = new Float32Array(vertexCount * 3), normals = new Float32Array(vertexCount * 3), uvs = new Float32Array(vertexCount * 2), indices = new Uint16Array(2 * COLS * ROWS * 6);
    var vbo = gl.createBuffer(), nbo = gl.createBuffer(), tbo = gl.createBuffer(), ibo = gl.createBuffer(), k = 0;
    for (var side = 0; side < 2; side++) {
      var base = side * (COLS + 1) * (ROWS + 1);
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var i = base + y * (COLS + 1) + x, a = i, b = i + 1, c = i + COLS + 1, d = c + 1;
        indices[k++] = a; indices[k++] = c; indices[k++] = b; indices[k++] = b; indices[k++] = c; indices[k++] = d;
      }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    [vbo,nbo,tbo].forEach(function (b) { gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER, b === vbo ? positions : b === nbo ? normals : uvs, gl.DYNAMIC_DRAW); });
    function buffer(buffer, data, location, width) { gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,data);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,width,gl.FLOAT,false,0,0); }
    function makeTexture() { var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t; }
    var fabricTex=makeTexture(), maskTex=makeTexture(), lastFabric="",lastMask="",hasMask=0, width=0,height=0;
    function upload(t,img) { if(!img||!img.complete||!img.naturalWidth)return false;gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);return true; }
    var meanCompression=[{c:1,a:0.08},{c:.84,a:.15},{c:.68,a:.23},{c:.52,a:.31}];
    function amplitude(compression) { for(var n=0;n<meanCompression.length-1;n++){var a=meanCompression[n],b=meanCompression[n+1];if(compression<=a.c&&compression>=b.c){var t=(a.c-compression)/(a.c-b.c);return a.a+(b.a-a.a)*t;}}return meanCompression[meanCompression.length-1].a; }
    function draw(fabric,mask,state) {
      if(!fabric||!fabric.complete||!fabric.naturalWidth)return false;
      var w=canvas.clientWidth||canvas.width,h=canvas.clientHeight||canvas.height;if(!w||!h)return false;
      if(width!==canvas.width||height!==canvas.height){width=canvas.width;height=canvas.height;gl.viewport(0,0,width,height);}
      var key=fabric.currentSrc||fabric.src;if(key!==lastFabric){upload(fabricTex,fabric);lastFabric=key;}
      var mk=mask&&(mask.currentSrc||mask.src);if(mask&&(mk!==lastMask||!hasMask)){hasMask=upload(maskTex,mask)?1:0;lastMask=mk;}
      var p=Math.max(0,Math.min(1,state.progress||0)),back=state.backlight||0, idx=0;
      for(var side=0;side<2;side++){
        var base=side*(COLS+1)*(ROWS+1),comp=1-.48*p,A=amplitude(comp),destW=.5-.34*p,destX=side===0?0:1-destW;
        for(var y=0;y<=ROWS;y++){var v=y/ROWS;for(var x=0;x<=COLS;x++){
          var u=x/COLS,phase=u*Math.PI*14,beta=2,alpha=A*Math.tanh(beta*Math.sin(phase))/Math.tanh(beta);
          var gatherCurve=Math.sin(phase)*Math.sin(alpha)*(.007+.012*p),sag=Math.sin(phase+v*1.6)*v*v*(.003+.012*p),z=Math.cos(phase)*Math.sin(alpha)*.05;
          var vi=base+y*(COLS+1)+x,pi=vi*3,ti=vi*2,textureSpan=.5-.33*p;
          positions[pi]=(destX+u*destW+gatherCurve+Math.sin(v*3+u*19)*.0015)*w;
          positions[pi+1]=(v+sag)*h;positions[pi+2]=z;
          uvs[ti]=(side===0?0:.5+(.5-textureSpan))+u*textureSpan;uvs[ti+1]=1-v;
          normals[pi]=Math.sin(phase)*.24;normals[pi+1]=Math.cos(phase)*.05;normals[pi+2]=1;
        }}
        if(!state.lite)for(var yy=0;yy<=ROWS;yy++)for(var xx=0;xx<=COLS;xx++){
          var vix=base+yy*(COLS+1)+xx, l=base+yy*(COLS+1)+Math.max(0,xx-1),r=base+yy*(COLS+1)+Math.min(COLS,xx+1),u0=base+Math.max(0,yy-1)*(COLS+1)+xx,u1=base+Math.min(ROWS,yy+1)*(COLS+1)+xx;
          var ax=positions[r*3]-positions[l*3],ay=positions[r*3+1]-positions[l*3+1],az=positions[r*3+2]-positions[l*3+2];
          var bx=positions[u1*3]-positions[u0*3],by=positions[u1*3+1]-positions[u0*3+1],bz=positions[u1*3+2]-positions[u0*3+2];
          var nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx,nl=Math.hypot(nx,ny,nz)||1,ni=vix*3;normals[ni]=nx/nl;normals[ni+1]=ny/nl;normals[ni+2]=nz/nl;
        }
      }
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform2f(uniforms.size,w,h);gl.uniform1f(uniforms.back,back);gl.uniform1f(uniforms.progress,p);gl.uniform1f(uniforms.hasMask,hasMask);
      buffer(vbo,positions,attrs.pos,3);buffer(nbo,normals,attrs.normal,3);buffer(tbo,uvs,attrs.uv,2);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,fabricTex);gl.uniform1i(uniforms.fabric,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,maskTex);gl.uniform1i(uniforms.mask,1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);return true;
    }
    return { draw: draw };
  }
  window.PardaMesh = { create: create };
})();
