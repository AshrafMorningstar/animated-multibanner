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

  // lights
  const key = new THREE.PointLight(0xff66c4,1.6,10); key.position.set(2,2,2); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7af0ff,0.9); rim.position.set(-3,5,2); scene.add(rim);
  // fox group
  const fox = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.9,24,18), new THREE.MeshStandardMaterial({color:0xff6ea1, emissive:0xff6ea1, emissiveIntensity:1.2, roughness:0.25}));
  body.scale.set(1.25,0.9,0.6); body.position.set(0,-0.2,0); fox.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45,20,16), new THREE.MeshStandardMaterial({color:0xff3b9a, emissive:0xff3b9a, emissiveIntensity:1.4, roughness:0.2}));
  head.position.set(0,0.45,0.6); fox.add(head);
  const cone = new THREE.ConeGeometry(0.18,0.32,16);
  const earL = new THREE.Mesh(cone, new THREE.MeshStandardMaterial({color:0xff7ab8, emissive:0xff7ab8, emissiveIntensity:1.6})); earL.position.set(-0.25,0.85,0.45); earL.rotation.set(-0.35,0,-0.25); fox.add(earL);
  const earR = earL.clone(); earR.position.set(0.25,0.85,0.45); earR.rotation.set(-0.35,0,0.25); fox.add(earR);
  const eyeMat = new THREE.MeshStandardMaterial({color:0x07121a, emissive:0x7af0ff, emissiveIntensity:0.12});
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06,12,12), eyeMat); eyeL.position.set(-0.12,0.46,0.98); fox.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.set(0.12,0.46,0.98); fox.add(eyeR);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05,12,12), new THREE.MeshStandardMaterial({color:0x000000})); nose.position.set(0,0.38,1.02); fox.add(nose);
  const tail = new THREE.Group();
  for(let i=0;i<6;i++){ const seg = new THREE.Mesh(new THREE.TorusGeometry(0.18-i*0.02,0.06,8,24), new THREE.MeshStandardMaterial({color:0x7af0ff, emissive:0x7af0ff, emissiveIntensity:1.0-i*0.08})); seg.rotation.y=Math.PI/2; seg.position.set(0.9+i*0.15,-0.05+i*0.02,-0.35-i*0.05); seg.rotation.x=0.18+i*0.06; tail.add(seg); }
  fox.add(tail);
  fox.position.y=-0.5; fox.rotation.y=Math.PI; scene.add(fox);

  let update = (t, mouse) => {
    fox.position.y = -0.45 + Math.sin(t*1.2)*0.03;
    tail.rotation.z = Math.sin(t*2.1)*0.18;
    head.rotation.y += ((mouse.x*0.25)-head.rotation.y)*0.08;
    head.rotation.x += ((mouse.y*0.12)-head.rotation.x)*0.04;
    eyeL.position.x = -0.12 + mouse.x*0.03;
    eyeR.position.x = 0.12 + mouse.x*0.03;
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
