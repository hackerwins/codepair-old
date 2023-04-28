import React from 'react';
import { useSelector } from 'react-redux';
import { MimeType } from 'constants/editor';
import { AppState } from 'app/rootReducer';
import { HeadingView } from './HeadingView';

export function CustomViewer() {
  const doc = useSelector((state: AppState) => state.docState.doc);
  const root = doc?.getRoot();
  const mimeType = root?.mimeType || MimeType.MARKDOWN;

  switch (mimeType) {
    case MimeType.MARKDOWN:
      return <HeadingView />;
    default:
      return null;
  }
}
