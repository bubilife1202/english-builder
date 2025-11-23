import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { PointerLockControls } from '@react-three/drei';

const SPEED = 5;
const JUMP_FORCE = 5;

export const Player = () => {
  const { camera } = useThree();
  const keys = useKeyboard();
  const controlsRef = useRef<any>(null);

  // Physics body for the player (sphere)
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5], // radius
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 5, 0]);

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((p) => {
      position.current = p;
      camera.position.set(p[0], p[1] + 0.5, p[2]);
    });

    return () => {
      unsubscribeVel();
      unsubscribePos();
    };
  }, [api, camera]);

  useFrame(() => {
    if (!controlsRef.current) return;

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(keys.backward) - Number(keys.forward)
    );
    const sideVector = new Vector3(
      Number(keys.left) - Number(keys.right),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Jump
    if (keys.jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
};
