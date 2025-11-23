import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2 } from 'three';
import type { BlockPosition } from '../types';
import { useGameStore } from '../store/useGameStore';

export const useRaycast = () => {
  const { camera, scene } = useThree();
  const blocks = useGameStore((state) => state.blocks);
  const [targetBlock, setTargetBlock] = useState<BlockPosition | null>(null);
  const [adjacentBlock, setAdjacentBlock] = useState<BlockPosition | null>(null);

  useEffect(() => {
    const raycaster = new Raycaster();

    const handleClick = (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return;

      // Set raycaster from camera
      raycaster.setFromCamera(new Vector2(0, 0), camera);

      // Find intersected blocks
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const normal = intersection.face?.normal;

        if (!normal) return;

        // Calculate block position
        const blockPos = {
          x: Math.floor(point.x + normal.x * 0.5),
          y: Math.floor(point.y + normal.y * 0.5),
          z: Math.floor(point.z + normal.z * 0.5),
        };

        // Left click = remove block
        if (event.button === 0) {
          setTargetBlock(blockPos);
        }
        // Right click = add block
        else if (event.button === 2) {
          const adjacentPos = {
            x: Math.floor(point.x + normal.x),
            y: Math.floor(point.y + normal.y),
            z: Math.floor(point.z + normal.z),
          };
          setAdjacentBlock(adjacentPos);
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      handleClick(e as any);
    });

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [camera, scene, blocks]);

  return { targetBlock, adjacentBlock };
};
