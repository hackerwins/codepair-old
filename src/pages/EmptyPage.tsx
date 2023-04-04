import React, { useEffect } from 'react';

export function EmptyPage() {
  useEffect(() => {
    console.log('Empty Page');
  }, []);

  return (
    <div>
      <h1>Empty Page</h1>
    </div>
  );
}
