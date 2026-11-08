/* Perspective planes share one cover projection at rest, then separate during the dolly. */
window.ToscanaAisle = function ({THREE, renderer, scene, camera, width, height}) {
  const textures=[], materials=[], geometries=[], planes=[];
  const loader=new THREE.TextureLoader();
  let disposed=false;
  const texture = path => new Promise((resolve,reject)=>loader.load(path,t=>{t.colorSpace=THREE.SRGBColorSpace;textures.push(t);if(disposed){t.dispose();reject(new Error('disposed'));}else resolve(t);},undefined,reject));
  function plane(map, depth, band=null, side=null) {
    const h=2*Math.tan(camera.fov*Math.PI/360)*depth,w=h*camera.aspect;
    const g=new THREE.PlaneGeometry(w,h); geometries.push(g);
    const screenAspect=width/height,imageAspect=2/3;
    const uv=g.attributes.uv;
    for(let i=0;i<uv.count;i++){
      let x=uv.getX(i),y=uv.getY(i);
      if(screenAspect<imageAspect)x=.5+(x-.5)*screenAspect/imageAspect;
      else y=.5+(y-.5)*imageAspect/screenAspect;
      uv.setXY(i,x,y);
    }
    const m=new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,side:THREE.DoubleSide});
    if(band){
      m.onBeforeCompile=shader=>{
        shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>\nif(vMapUv.y < ${band[0].toFixed(4)} || vMapUv.y > ${band[1].toFixed(4)}) discard;\n${side==='left'?'if(vMapUv.x > 0.5) discard;':'if(vMapUv.x < 0.5) discard;'}`);
      };
      m.customProgramCacheKey=()=>`${band.join('-')}-${side}`;
    }
    materials.push(m);const mesh=new THREE.Mesh(g,m);mesh.position.z=-depth;mesh.renderOrder=20-depth;scene.add(mesh);planes.push(mesh);
  }
  const ready=Promise.all([texture('art/aisle-background.webp'),texture('art/aisle-chairs.webp')]).then(([background,chairs])=>{
    if(disposed)return;
    plane(background,14);
    // Crop along depth rows in source coordinates, leaving the runner transparent.
    for(const side of ['left','right']) plane(chairs,6.5,[0,1],side);
    renderer.render(scene,camera);
  });
  return {ready,dispose(){disposed=true;planes.forEach(p=>scene.remove(p));textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());}};
};
