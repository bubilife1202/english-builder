import { useMemo, useRef } from 'react';
import { useBox } from '@react-three/cannon';
import { Color, InstancedMesh, Object3D, MeshStandardMaterial } from 'three';
import { useGameStore } from '../store/useGameStore';
import type { BlockType } from '../types';

const BLOCK_SIZE = 1;

// Block colors
const blockColors: Record<BlockType, string> = {
  grass: '#4CAF50',
  dirt: '#8B4513',
  wood: '#D2691E',
  stone: '#808080',
};

export const Ground = () => {
  const blocks = useGameStore((state) => state.blocks);

  // Group blocks by type for efficient rendering
  const blocksByType = useMemo(() => {
    const grouped: Record<BlockType, typeof blocks> = {
      grass: [],
      dirt: [],
      wood: [],
      stone: [],
    };

    blocks.forEach((block) => {
      grouped[block.type].push(block);
    });

    return grouped;
  }, [blocks]);

  // Create physics bodies for all blocks
  blocks.forEach((block) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBox(() => ({
      type: 'Static',
      position: [block.x, block.y, block.z],
      args: [BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE],
    }));
  });

  return (
    <group>
      {(Object.keys(blocksByType) as BlockType[]).map((type) => {
        const blocksOfType = blocksByType[type];
        if (blocksOfType.length === 0) return null;

        return (
          <InstancedBlocks
            key={type}
            blocks={blocksOfType}
            color={blockColors[type]}
          />
        );
      })}
    </group>
  );
};

interface InstancedBlocksProps {
  blocks: Array<{ x: number; y: number; z: number }>;
  color: string;
}

const InstancedBlocks = ({ blocks, color }: InstancedBlocksProps) => {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useMemo(() => new Object3D(), []);

  useMemo(() => {
    if (!meshRef.current) return;

    blocks.forEach((block, i) => {
      tempObject.position.set(block.x, block.y, block.z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks, tempObject]);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
      }),
    [color]
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, material, blocks.length]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
    </instancedMesh>
  );
};
