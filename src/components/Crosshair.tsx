export const Crosshair = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'white',
          transform: 'translateY(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '0',
          width: '2px',
          height: '100%',
          background: 'white',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
};
