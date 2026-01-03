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
  scene.background = new THREE.Color(0x111111);
  const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,100);
  camera.position.set(0,1.2,3.8);
  const ambient = new THREE.AmbientLight(0x404040,0.6); scene.add(ambient);
  const light = new THREE.DirectionalLight(0xffffff,1.0); light.position.set(5,5,5); scene.add(light);

  // load local textures (placeholders included)
  const loader = new THREE.TextureLoader();
  const albedo = loader.load('../textures/albedo.png');
  const rough = loader.load('../textures/roughness.png');
  const metal = loader.load('../textures/metalness.png');
  const normal = loader.load('../textures/normal.png');

  const geo = new THREE.SphereGeometry(0.9,64,64);
  const mat = new THREE.MeshStandardMaterial({
    map: albedo,
    roughnessMap: rough,
    metalnessMap: metal,
    normalMap: normal,
    metalness: 0.8,
    roughness: 0.4
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0;
  scene.add(mesh);

  window.addEventListener('resize', ()=>{ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();
  return { renderer, scene, camera, dispose: ()=>{ renderer.dispose(); } };
}
