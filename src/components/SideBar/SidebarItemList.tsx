import React, { Fragment } from 'react';
import { Collapse, List } from '@mui/material';
import { AppState } from 'app/rootReducer';
import { ItemType } from 'features/linkSlices';
import { useSelector } from 'react-redux';
import { GroupItem } from './CustomViewer/GroupView';
import { SidebarItem } from './CustomViewer/SidebarItem';

type LoopType = 'links' | 'favorite' | 'date';

interface SideBarItemListProps {
  links: ItemType[];
  level: number;
  loopType: LoopType;
}

export function SideBarItemList({ links, level, loopType }: SideBarItemListProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <List style={{ padding: 0 }}>
      {[...links].map((it) => {
        return (
          <Fragment key={it.id}>
            {it.type === 'group' ? (
              <GroupItem key={it.id} group={it} level={level} loopType={loopType} />
            ) : (
              <SidebarItem key={it.id} item={it} level={level} loopType={loopType} />
            )}

            {it.links && (
              <Collapse in={opens[it.id]} timeout="auto" unmountOnExit>
                <SideBarItemList links={it.links?.filter(Boolean)} level={level + 1} loopType={loopType} />
              </Collapse>
            )}
          </Fragment>
        );
      })}
    </List>
  );
}
