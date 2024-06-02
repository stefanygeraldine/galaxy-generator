import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ISize } from "./Scene.tsx";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
}

function Galaxy(props: IProps) {
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderer, scene, camera, size } = props;
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //Parameters
  const parameters = {
    count: 1000,
    size: 0.02,
    radius: 5,
  };

  let geometry: THREE.BufferGeometry;
  let material: THREE.PointsMaterial;
  let points: THREE.Points;

  const generateGalaxy = () => {
    //Destroy old galaxy
    if (points) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }
    geometry = new THREE.BufferGeometry();
    const position = new Float32Array(parameters.count * 3);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      /* (- 0.5 center position) ( * 3 distance between points)*/
      position[i3] = (Math.random() - 0.5) * 3;
      position[i3 + 1] = (Math.random() - 0.5) * 3;
      position[i3 + 2] = (Math.random() - 0.5) * 3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

    // Material
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Points
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };
  //Tweak
  const gui = new dat.GUI();
  useEffect(() => {
    generateGalaxy();

    gui
      .add(parameters, "count", 100, 1000000, 100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "size", 0.001, 0.1, 0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "radius", 0.01, 20, 0.01)
      .onFinishChange(generateGalaxy);

    camera.position.z = 5;

    const tick = () => {
      requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };

    tick();
  }, []);

  return <div></div>;
}

export default Galaxy;
