import React, { useState } from 'react';
import EditorTab from './EditorTab';
import AddButton from './AddButton';
import './index.scss';

/* For test only */
const temp = [
  { id: 0, title: '1' }, 
  { id: 1, title: '2' }, 
  { id: 2, title: '3' }, 
  { id: 3, title: '4' }, 
  { id: 4, title: '5' }, 
  { id: 5, title: '6' }, 
  { id: 6, title: '7' }, 
  { id: 7, title: '8' }, 
];

export default function EditorTabNav() {
  const [selected, setSelected] = useState<number>(1);

  return (
    <nav className="editor-tab-nav">
      <ul id="x-scroller">
        {temp.map((t) => (
          <EditorTab key={t.id} isSelected={t.id === selected} {...t} onChange={setSelected} />
        ))}
      </ul>
      <AddButton />
    </nav>
  );
}
