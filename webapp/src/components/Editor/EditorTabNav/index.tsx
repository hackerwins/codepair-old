import React, { useMemo } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { selectDoc } from 'features/docSlices';
import { useSelector } from 'react-redux';
import { Theme, selectMenu } from 'features/settingSlices';
import EditorTab from './EditorTab';
import AddButton from './AddButton';
import './index.scss';

export default function EditorTabNav() {
  const location = useLocation();
  const { tab } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const menu = useSelector(selectMenu);
  const doc = useSelector(selectDoc);
  const tabLength = useMemo(() => doc?.getRoot().contents.length ?? 0, [doc]);
  const isDarkmode = useMemo<boolean>(() => menu.theme === Theme.Dark, [menu]);

  return (
    <nav className={`editor-tab-nav ${isDarkmode ? 'darkmode' : 'lightmode'}`}>
      <ul id="x-scroller">
        {[...Array(tabLength)].map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <EditorTab key={index} isSelected={`${index}` === tab} index={index} />
        ))}
      </ul>
      <AddButton />
    </nav>
  );
}
