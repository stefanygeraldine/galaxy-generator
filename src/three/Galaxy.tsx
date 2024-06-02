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

interface IParameters {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
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

  const parameters: IParameters = {
    count: 73000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 3,
    randomness: 0.2,
    randomnessPower: 5,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
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
    const colors = new Float32Array(parameters.count * 3);
    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      //Positions
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const getRandomness = () =>
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      // Math.pow(Math.random(), parameters.randomness) * (Math.random() < 0.5 ? 1 : -1);

      /* (- 0.5 center position) ( * 3 distance between points) (Math.random() - 0.5) * 3;*/
      position[i3] =
        Math.cos(branchAngle + spinAngle) * radius + getRandomness();
      position[i3 + 1] = getRandomness();
      position[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + getRandomness();

      geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

      //Colors
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    // Points
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  //Tweak
  const gui = new dat.GUI();
  const addTweaks = (
    name: keyof IParameters,
    min: number,
    max: number,
    step: number,
  ): void => {
    gui.add(parameters, name, min, max, step).onFinishChange(generateGalaxy);
  };

  const addColor = (name: keyof IParameters): void => {
    gui.addColor(parameters, name).onFinishChange(generateGalaxy);
  };

  useEffect(() => {
    generateGalaxy();
    addTweaks("count", 100, 1000000, 100);
    addTweaks("size", 0.001, 0.1, 0.001);
    addTweaks("radius", 0.01, 20, 0.01);
    addTweaks("branches", 1, 20, 1);
    addTweaks("spin", -5, 5, 0.001);
    addTweaks("randomness", 0, 2, 0.001);
    addTweaks("randomnessPower", 1, 10, 0.001);
    addColor("insideColor");
    addColor("outsideColor");

    //camera.position.z = 5;

    // Posicionar la cámara por encima del cubo
    camera.position.set(0, 10, 10); // x, y, z (la cámara está a 5 unidades por encima del cubo)
    camera.lookAt(points.position);
    //const clock = new THREE.Clock();

    const tick = () => {
      requestAnimationFrame(tick);
      points.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    tick();
  }, []);

  return <div></div>;
}

export default Galaxy;
