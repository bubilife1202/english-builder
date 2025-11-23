import { Text } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';

export const WordBlockLabels = () => {
  const blocks = useGameStore((state) => state.blocks);

  return (
    <>
      {blocks
        .filter((block) => block.word)
        .map((block, index) => (
          <Text
            key={`${block.x}-${block.y}-${block.z}-${index}`}
            position={[block.x, block.y + 1, block.z]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="black"
          >
            {block.word}
          </Text>
        ))}
    </>
  );
};
