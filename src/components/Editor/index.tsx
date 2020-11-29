import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import CodeNavBar from './CodeNavBar';
import CodeEditor from './CodeEditor';
import { Menu } from '../../reducers/settingReducer';
import {
  SetCodeMode,
  SetCodeTheme,
  SetCodeKeyMap,
  SetTabSize,
  TabSize,
  CodeKeyMap,
  CodeTheme,
  CodeMode,
} from '../../actions/settingActions';

import { SettingModel } from '../../data/browser-storage';

type DocPageProps = {
  docKey: string;
};

const Editor = () => {
  const { docKey } = useParams() as DocPageProps;
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = SettingModel.getValue() as Menu;
    if (!menu) {
      return;
    }
    if (menu.codeMode) {
      dispatch(SetCodeMode(menu.codeMode as CodeMode));
    }
    if (menu.codeTheme) {
      dispatch(SetCodeTheme(menu.codeTheme as CodeTheme));
    }
    if (menu.codeKeyMap) {
      dispatch(SetCodeKeyMap(menu.codeKeyMap as CodeKeyMap));
    }
    if (menu.tabSize) {
      dispatch(SetTabSize(menu.tabSize as TabSize));
    }
  }, [dispatch]);

  return (
    <>
      <CodeNavBar />
      <CodeEditor docKey={docKey} />
    </>
  );
};

export default Editor;
