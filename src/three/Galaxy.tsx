import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { ISize } from "./Scene.tsx";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
}



function Galaxy(props: IProps) {
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const {renderer, scene, camera, size} = props;
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //Parameters
  const parameters = {
    count: 1000,
    size: 0.02
  }

const generateGalaxy = () => {
    const geometry = new THREE.BufferGeometry();
    const position = new Float32Array(parameters.count * 3)

  for(let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    position[i3] = Math.random()
    position[i3 + 1] = Math.random()
    position[i3 + 2] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

  // Material
  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  // Particles
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

  useEffect(() => {
generateGalaxy()
    camera.position.z = 5;
    //const clock = new THREE.Clock();
    const tick = () => {

      requestAnimationFrame(tick);

      // Animación del cubo
      // particles.rotation.x += 0.01;
      //particles.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    tick();
  }, []);

  return <div></div>;
}

export default Galaxy;
