/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
export default function initScene(canvas){ 
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05030a);
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,1.6,4);
  const ambient = new THREE.AmbientLight(0x404050,0.6); scene.add(ambient);
  window.addEventListener('resize', ()=>{ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
  const clock = new THREE.Clock();
  const mouse = {x:0,y:0};
  window.addEventListener('pointermove', (e)=>{ mouse.x=(e.clientX/window.innerWidth)*2-1; mouse.y=-(e.clientY/window.innerHeight)*2+1; });

  const key = new THREE.PointLight(0xff9a3b,1.8,12); key.position.set(2,2,2); scene.add(key);
  const fill = new THREE.AmbientLight(0x202020,0.6); scene.add(fill);
  const phoenix = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6,24,20), new THREE.MeshStandardMaterial({color:0xff6e2b, emissive:0xff6e2b, emissiveIntensity:1.6, roughness:0.2}));
  body.position.set(0,0,0); phoenix.add(body);
  // tail feathers
  for(let i=0;i<10;i++){
    const f = new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.2), new THREE.MeshStandardMaterial({color:0xffa84d, emissive:0xffa84d, side:THREE.DoubleSide}));
    f.position.set(-0.3 - i*0.08, -0.1 - i*0.02, (i-5)*0.08);
    f.rotation.set(0.2 + i*0.05, 0, i*0.02);
    phoenix.add(f);
  }
  phoenix.position.y=-0.2; scene.add(phoenix);

  let update = (t, mouse) => {
    phoenix.position.y = -0.2 + Math.sin(t*1.6)*0.06;
    phoenix.rotation.y += 0.003;
  };

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    // user animation hook
    if (update) update(t, mouse);
    renderer.render(scene, camera);
  }
  animate();
  // return dispose hook
  return { renderer, scene, camera, dispose: ()=>{ renderer.dispose(); } };
}
