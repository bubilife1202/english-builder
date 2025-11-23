import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2 } from 'three';
import { useGameStore } from '../store/useGameStore';
import type { BlockType } from '../types';

export const BlockInteraction = () => {
  const { camera, scene } = useThree();
  const addBlock = useGameStore((state) => state.addBlock);
  const removeBlock = useGameStore((state) => state.removeBlock);

  useEffect(() => {
    const raycaster = new Raycaster();
    raycaster.far = 10; // Maximum reach distance

    const handleClick = (event: MouseEvent) => {
      // Only work when pointer is locked
      if (document.pointerLockElement === null) return;

      // Prevent default context menu
      event.preventDefault();

      // Raycast from camera center
      raycaster.setFromCamera(new Vector2(0, 0), camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const normal = intersection.face?.normal;

        if (!normal) return;

        // Left click (button 0) = Remove block
        if (event.button === 0) {
          const blockPos = {
            x: Math.floor(point.x - normal.x * 0.5),
            y: Math.floor(point.y - normal.y * 0.5),
            z: Math.floor(point.z - normal.z * 0.5),
          };
          removeBlock(blockPos);
        }
        // Right click (button 2) = Add block
        else if (event.button === 2) {
          const blockPos = {
            x: Math.floor(point.x + normal.x * 0.5),
            y: Math.floor(point.y + normal.y * 0.5),
            z: Math.floor(point.z + normal.z * 0.5),
          };
          // For now, always add grass blocks
          // Later we'll make this selectable from inventory
          addBlock(blockPos, 'grass' as BlockType);
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [camera, scene, addBlock, removeBlock]);

  return null;
};
