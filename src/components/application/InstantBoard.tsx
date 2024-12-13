import React from 'react';

export function InstantBoard() {
  const oldURL = new URL(window.location.href);
  const newHostname = oldURL.hostname.replace('-old', '');
  const newURL = `${oldURL.protocol}//${newHostname}${oldURL.port ? `:${oldURL.port}` : ''}`;

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
