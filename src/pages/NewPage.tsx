import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { newLink } from 'features/linkSlices';
import { useNavigate } from 'react-router-dom';

export function NewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get current page when the page is empty
  const newDocKey = `${Math.random().toString(36).substring(7)}`;
  const fileLink = `/${newDocKey}`;

  useEffect(() => {
    dispatch(newLink({ parentId: '', name: 'Untitled page', fileLink, mimeType: 'text/markdown' }));

    setTimeout(() => {
      navigate(fileLink);
    }, 1000);
  }, [dispatch, navigate, newDocKey, fileLink]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      Creating new page...
    </div>
  );
}
