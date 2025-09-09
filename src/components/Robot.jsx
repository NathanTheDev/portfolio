import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import robotPath from "@/assets/robot.glb";
import basePath from "@/assets/base.glb";
import aboutPath from "@/assets/about.glb";
import Navigation from "./Navigation";
import { AnimationMixer, LoopOnce, Vector3 } from "three";

const cloneWithMaterials = (object) => {
  const cloned = object.clone(true);
  cloned.traverse((child) => {
    if (child.isMesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => {
          const mat = m.clone();
          if (m.map) mat.map = m.map.clone();
          return mat;
        });
      } else {
        const mat = child.material;
        child.material = mat.clone();
        if (mat.map) child.material.map = mat.map.clone();
      }
      child.castShadow = true;
    }
  });
  return cloned;
};

const useCachedGLTF = (path) => {
  const cacheRef = useRef(null);
  if (!cacheRef.current) {
    const gltf = useGLTF(path);
    const clonedScene = cloneWithMaterials(gltf.scene);
    clonedScene.position.set(0, 0, 0);
    cacheRef.current = {
      scene: clonedScene,
      animations: gltf.animations || [],
    };
  }
  return cacheRef.current;
};

const AnimatedModel = ({ path, playOnce, onFinished, position = [0, 1, 0] }) => {
  const { scene, animations } = useCachedGLTF(path);
  const modelRef = useRef();
  const mixer = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.PI;
      modelRef.current.position.set(...position);
    }
    if (animations.length > 0) {
      mixer.current = new AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        if (playOnce) {
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
        }
        action.play();
        if (playOnce) {
          mixer.current.addEventListener("finished", onFinished);
        }
      });
    } else if (playOnce) {
      onFinished?.();
    }
    return () => mixer.current?.stopAllAction();
  }, [animations, scene]);

  useFrame(({ clock }, delta) => {
    if (!playOnce && modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(clock.elapsedTime) * 0.1;
    }
    mixer.current?.update(delta);
  });

  return <primitive ref={modelRef} object={scene} />;
};

const AboutModel = () => {
  const { scene, animations } = useCachedGLTF(aboutPath);
  const mixer = useRef();
  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
    return () => mixer.current?.stopAllAction();
  }, [animations, scene]);
  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });
  return <primitive object={scene} />;
};

const GroundPlane = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, -0.75, 0]} receiveShadow>
    <planeGeometry args={[500, 500]} />
    <meshStandardMaterial color="lightgrey" />
  </mesh>
);

function interpolateCamera(camera, targetPos, targetLookAt, alpha = 0.05) {
  camera.position.lerp(targetPos, alpha);
  if (!camera.userData.currentLookAt) {
    camera.userData.currentLookAt = new Vector3();
    camera.userData.currentLookAt.copy(targetLookAt);
  }
  camera.userData.currentLookAt.lerp(targetLookAt, alpha);
  camera.lookAt(camera.userData.currentLookAt);
}

const CameraController = ({ cameraRef, targetPos, targetLookAt }) => {
  useFrame(() => {
    if (cameraRef.current) interpolateCamera(cameraRef.current, targetPos, targetLookAt, 0.05);
  });
  return null;
};

const Robot = () => {
  const cameraRef = useRef();
  const [viewAbout, setViewAbout] = useState(false);
  const [robotPlayed, setRobotPlayed] = useState(false);
  const [targetPos, setTargetPos] = useState(new Vector3(0, 5, 7));
  const [targetLookAt, setTargetLookAt] = useState(new Vector3(0, 2.5, 0));

  const handleClick = (label) => {
    if (label === "Home") {
      setViewAbout(false);
      setTargetPos(new Vector3(0, 5, 7));
      setTargetLookAt(new Vector3(0, 2.5, 0));
    }
    if (label === "About") {
      setViewAbout(true);
      setTargetPos(new Vector3(0, 5.25, 0));
      setTargetLookAt(new Vector3(0, 0, 0));
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        style={{ background: "#F2F2F2" }}
        shadows
        camera={{ position: [0, 5, 7], fov: 50 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 2.5, 0);
          cameraRef.current = camera;
        }}
      >
        <CameraController cameraRef={cameraRef} targetPos={targetPos} targetLookAt={targetLookAt} />
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={10}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {!viewAbout && !robotPlayed && (
          <AnimatedModel
            path={robotPath}
            playOnce={true}
            onFinished={() => setRobotPlayed(true)}
            position={[0, 1, 0]}
          />
        )}
        {!viewAbout && robotPlayed && <AnimatedModel path={basePath} position={[0, 1, 0]} />}
        {viewAbout && <AboutModel />}
        <GroundPlane />
        <Html position={[0, 0, 0]} />
      </Canvas>
      <Navigation clickFn={handleClick} />
    </div>
  );
};

export default Robot;
