import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { ISize } from "./Scene.tsx";
import Particle from "../assets/materials/blackBackground/magic_01.png";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
}

function Particles(props: IProps) {
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderer, scene, camera, size } = props;
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  useEffect(() => {
    // Particle
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3),
    );

    const textureLoader = new THREE.TextureLoader();
    const particuleTexture = textureLoader.load(Particle);

    const particlesMaterial = new THREE.PointsMaterial();
    particlesMaterial.size = 0.1;
    particlesMaterial.sizeAttenuation = true;
    particlesMaterial.color = new THREE.Color("#ff88cc");
    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particuleTexture;
    // particlesMaterial.alphaTest = 0.001;
    // particlesMaterial.depthTest = false;
    particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending;
    particlesMaterial.vertexColors = true;

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /*
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),Float32Array is:
      new THREE.MeshBasicMaterial(),
    );
    scene.add(cube);
     */

    // Particle
    const particlesGeometry2 = new THREE.SphereGeometry(1, 32, 32);
    const particlesMaterial2 = new THREE.PointsMaterial();
    particlesMaterial2.size = 0.02;
    particlesMaterial2.sizeAttenuation = true;
    const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial2);
    scene.add(particles2);

    camera.position.z = 5;
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      requestAnimationFrame(tick);

      // Animación del cubo
      // particles.rotation.x += 0.01;
      //particles.rotation.y += 0.01;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const y = 1;
        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + y] = Math.sin(
          elapsedTime + x,
        );
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    tick();
  }, []);

  return <div></div>;
}

export default Particles;
