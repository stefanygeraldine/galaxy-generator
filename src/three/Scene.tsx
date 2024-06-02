import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import * as dat from "dat.gui"
import Galaxy from "./Galaxy.tsx";

//const gui = new dat.GUI()
const scene = new THREE.Scene();
// Canvas
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#000");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

camera.position.z = 5;
scene.add(camera);

export interface ISize {
  width: number;
  height: number;
}
function Scene() {
  const [size, setSize] = useState<ISize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = useCallback(() => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return <Galaxy camera={camera} size={size} scene={scene} renderer={renderer} />;
}

export default Scene;
