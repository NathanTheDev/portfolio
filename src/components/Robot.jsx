import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import robotPath from "@/assets/robot.glb";

const RobotModel = () => {
  const { scene } = useGLTF(robotPath);
  scene.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });
  return <primitive object={scene} />;
};

const GroundPlane = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="lightgrey" />
  </mesh>
);

const Robot = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <RobotModel />
        <GroundPlane />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Robot;
