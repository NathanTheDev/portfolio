import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import robotPath from "@/assets/robot.glb";
import aboutPath from "@/assets/about.glb";
import Navigation from "./Navigation";

const useCachedGLTF = (path) => {
  const cacheRef = useRef(null);

  if (!cacheRef.current) {
    const { scene } = useGLTF(path);
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
    cloned.position.set(0, 0, 0);
    cacheRef.current = cloned;
  }

  return cacheRef.current;
};

const RobotModel = () => {
  const scene = useCachedGLTF(robotPath);
  const robotRef = useRef();

  useFrame(({ clock }) => {
    if (robotRef.current) {
      robotRef.current.position.y = 1 + Math.sin(clock.elapsedTime) * 0.5;
    }
  });

  return <primitive ref={robotRef} object={scene} />;
};

const AboutModel = () => {
  const scene = useCachedGLTF(aboutPath);
  return <primitive object={scene} />;
};

const GroundPlane = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, -0.75, 0]} receiveShadow>
    <planeGeometry args={[500, 500]} />
    <meshStandardMaterial color="lightgrey" />
  </mesh>
);

const Robot = () => {
  const cameraRef = useRef();
  const [viewAbout, setViewAbout] = useState(false);

  const handleClick = (label) => {
    if (!cameraRef.current) return;

    if (label === "Home") {
      setViewAbout(false);
      cameraRef.current.position.set(0, 5, 7);
      cameraRef.current.lookAt(0, 2.5, 0);
    }

    if (label === "About") {
      setViewAbout(true);
      cameraRef.current.position.set(0, 5.25, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }

    console.log(label);
  };

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows
        camera={{ position: [0, 5, 7], fov: 50 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 2.5, 0);
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={10}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {!viewAbout && <RobotModel />}
        {viewAbout && <AboutModel />}

        <GroundPlane />
        <Html position={[0, 0, 0]} />
      </Canvas>

      <Navigation clickFn={handleClick} />
    </div>
  );
};

export default Robot;
