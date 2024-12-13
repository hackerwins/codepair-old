import React from 'react';

export function InstantBoard() {
  const oldURL = window.location.hostname;
  const newURL = oldURL.replace('-old', '');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        height: '100%',
        overflow: 'hidden',
        padding: 16,
        flexDirection: 'column',
      }}
    >
      <p>CodePair v2 is released! 🎉 You can now share your code with your friends and code together in real-time.</p>
      <p>
        Visit&nbsp;
        <a href={newURL}>{newURL}</a>
        &nbsp;to start coding together.
      </p>
    </div>
  );
}
