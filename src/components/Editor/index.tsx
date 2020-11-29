import React from 'react';
import { useParams } from 'react-router';

import CodeNavBar from './CodeNavBar';
import CodeEditor from './CodeEditor';
type DocPageProps = {
  docKey: string;
};

const Editor = () => {
  const { docKey } = useParams() as DocPageProps;

  return (
    <>
      <CodeNavBar />
      <CodeEditor docKey={docKey} />
    </>
  );
};

export default Editor;
