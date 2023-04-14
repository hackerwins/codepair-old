import React from 'react';
import { useParams } from 'react-router-dom';

import Editor from 'components/Editor';
import PageLayout from './PageLayout';

type DocPageProps = {
  docKey: string;
};

export default function DocPage() {
  const { docKey = '' } = useParams<DocPageProps>();

  return (
    <PageLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Editor key={docKey} docKey={docKey} />
      </div>
    </PageLayout>
  );
}
