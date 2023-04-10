import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentPage } from 'features/currentSlices';
import { createDocumentKey } from 'utils/document';

export function EmptyPage() {
  // get current page when the page is empty
  const newKey = createDocumentKey();
  const initializeDocKey = getCurrentPage(newKey)().docKey || newKey;

  return <Navigate replace to={`/${initializeDocKey}`} />;
}
