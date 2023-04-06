import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentPage } from 'features/currentSlices';

export function EmptyPage() {
  // get current page when the page is empty
  const initializeDocKey = getCurrentPage(Math.random().toString(36).substring(7))().docKey;

  return <Navigate replace to={`/${initializeDocKey}`} />;
}
