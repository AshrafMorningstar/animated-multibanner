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

  const key = new THREE.PointLight(0xff8f3b,1.6,12); key.position.set(2,3,2); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7af0ff,0.6); rim.position.set(-4,6,2); scene.add(rim);
  const dragon = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.45,1.0,8,16), new THREE.MeshStandardMaterial({color:0xff884d, emissive:0xff5533, emissiveIntensity:1.2, roughness:0.25}));
  body.rotation.z = 0.2; body.position.set(0,-0.1,0); dragon.add(body);
  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35,20,16), new THREE.MeshStandardMaterial({color:0xffbb77, emissive:0xffbb77, emissiveIntensity:1.2}));
  head.position.set(0.9,0.3,0.1); dragon.add(head);
  // wings (simple planes)
  const wingGeo = new THREE.PlaneGeometry(1.2,0.6,4,4);
  const wingL = new THREE.Mesh(wingGeo, new THREE.MeshStandardMaterial({color:0xff6ea1, emissive:0xff6ea1, side:THREE.DoubleSide}));
  wingL.position.set(-0.2,0.2,-0.6); wingL.rotation.set(0.2,0.2,0);
  dragon.add(wingL);
  const wingR = wingL.clone(); wingR.position.set(-0.2,0.2,0.6); wingR.rotation.set(0.2,-0.2,0); dragon.add(wingR);
  dragon.scale.set(1.1,1.1,1.1); dragon.position.y=-0.3; scene.add(dragon);

  let update = (t, mouse) => {
    dragon.position.y = -0.25 + Math.sin(t*1.1)*0.04;
    wingL.rotation.z = Math.sin(t*4.0)*0.4;
    wingR.rotation.z = -Math.sin(t*4.0)*0.4;
    head.rotation.y += ((mouse.x*0.15)-head.rotation.y)*0.06;
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
