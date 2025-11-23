import { useEffect, useState } from 'react';

export const useKeyboard = () => {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case 'KeyA':
          setKeys((k) => ({ ...k, left: true }));
          break;
        case 'KeyD':
          setKeys((k) => ({ ...k, right: true }));
          break;
        case 'Space':
          setKeys((k) => ({ ...k, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case 'KeyA':
          setKeys((k) => ({ ...k, left: false }));
          break;
        case 'KeyD':
          setKeys((k) => ({ ...k, right: false }));
          break;
        case 'Space':
          setKeys((k) => ({ ...k, jump: false }));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};
