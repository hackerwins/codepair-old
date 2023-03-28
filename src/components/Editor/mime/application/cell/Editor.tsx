import React, { useEffect } from 'react';

export default function CellEditor() {
  useEffect(() => {
    (window as any).x_spreadsheet('#container');
  }, []);

  return (
    <div
      id="container"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
      }}
    />
  );
}
