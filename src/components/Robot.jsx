import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import robotPath from "@/assets/robot.glb";

const RobotModel = () => {
	const { scene } = useGLTF(robotPath);
	const robotRef = useRef();

  scene.traverse((child) => {
    if (child.isMesh) {
			child.castShadow = true;
		}
  });

	scene.position.set(0, 0, 0);

	useFrame(({ clock }) => {
    if (robotRef.current) {
      robotRef.current.position.y = 1 + Math.sin(clock.elapsedTime) * 0.5;
    }
  });

  return <primitive ref={robotRef} object={scene} />;
};

const GroundPlane = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, -0.75, 0]} receiveShadow>
    <planeGeometry args={[500, 500]} />
    <meshStandardMaterial color="lightgrey" />
  </mesh>
);

const Robot = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={10}
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
