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

  const key = new THREE.PointLight(0x7af0ff,1.4,12); key.position.set(2,2,2); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff66c4,0.8); rim.position.set(-3,5,2); scene.add(rim);
  const wolf = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.9,24,18), new THREE.MeshStandardMaterial({color:0x8fb3ff, emissive:0x7af0ff, emissiveIntensity:1.0, roughness:0.25}));
  body.scale.set(1.3,0.9,0.7); body.position.set(0,-0.2,0); wolf.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45,20,16), new THREE.MeshStandardMaterial({color:0xa8d4ff, emissive:0x7af0ff, emissiveIntensity:1.2}));
  head.position.set(0,0.45,0.6); wolf.add(head);
  wolf.position.y=-0.5; wolf.rotation.y=Math.PI; scene.add(wolf);

  let update = (t, mouse) => {
    wolf.position.y = -0.45 + Math.sin(t*0.9)*0.02;
    head.rotation.y += ((mouse.x*0.2)-head.rotation.y)*0.06;
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
