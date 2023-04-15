import React, { Fragment, useCallback, useEffect, useRef } from 'react';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { LinkItemType, setLinkOpens, toFlatScheduleForDate } from 'features/linkSlices';
import { isDateWorkspace } from 'utils/document';
import dayjs from 'dayjs';
import { ListSubheader } from '@mui/material';
import { HeadingItem } from './HeadingItem';
import { SidebarItemView } from './SidebarItem';
import { GroupView } from './GroupView';

function traverse(parent: any, data: any[], callback: (item: any, parent: any) => void) {
  data.forEach((item) => {
    callback(item, parent);
    traverse(item, (item.links || []).filter(Boolean), callback);
  });
}

function findOne(data: any[], callback: (item: any) => boolean) {
  let result: any = null;
  traverse(null, data, (item) => {
    if (callback(item)) {
      result = item;
    }
  });
  return result;
}

interface OpenState {
  [key: string]: boolean;
}

export function LinkTreeView() {
  const dispatch = useDispatch();
  const linkState = useSelector((state: AppState) => state.linkState);
  const selectedDate = useSelector((state: AppState) => state.calendarState.selectedDate);
  const currentLinks = useSelector(toFlatScheduleForDate(selectedDate));

  console.log(currentLinks);

  const linkRef = useRef<boolean>(false);
  const { docKey } = useParams<{ docKey: string }>();

  const showTreeNode = useCallback(
    (id: string) => {
      const parentList: string[] = [];
      let currentDepth = -1;

      function searchPath(data: unknown[], depth: number, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
          if (!data[i]) continue;

          parentList[depth] = (data[i] as any).id;
          if (callback(data[i])) {
            currentDepth = depth;
            found = true;
            break;
          }
          if ((data[i] as any).links) {
            if (searchPath((data[i] as any).links, depth + 1, callback)) {
              found = true;
              break;
            }
          }
        }

        return found;
      }

      searchPath(linkState.links, 0, (item) => {
        return item?.id === id;
      });

      if (currentDepth > -1) {
        const newOpens: OpenState = {};

        parentList.forEach((it) => {
          newOpens[it] = true;
        });

        // update
        dispatch(setLinkOpens(newOpens));
      }
    },
    [linkState.links, dispatch],
  );

  useEffect(() => {
    if (linkRef.current) return;

    if (docKey) {
      const findItem = findOne(linkState.links?.filter(Boolean), (item) => item.fileLink === `/${docKey}`);
      if (findItem) {
        showTreeNode(findItem.id);
        linkRef.current = true;
      }
    }
  }, [docKey, showTreeNode, linkState.links]);

  if (isDateWorkspace(linkState.workspace)) {
    let lastDate = '';

    return (
      <>
        {currentLinks.reverse().map((it) => {
          if (it.type === 'link' && it.linkType === 'heading') {
            return <HeadingItem key={`${it.id}${it.color}`} item={it as LinkItemType} level={0} loopType="favorite" />;
          }

          const currentDate = dayjs(it.createdAt, 'YYYYMMDDHHmm').format('YYYYMMDD');

          if (lastDate !== currentDate) {
            lastDate = currentDate;
            return (
              <Fragment key={`${it.id}${it.color}`}>
                <ListSubheader>{dayjs(it.createdAt, 'YYYYMMDDHHmm').format('YYYY-MM-DD')}</ListSubheader>
                <SidebarItemView item={it as LinkItemType} loopType="favorite" />
              </Fragment>
            );
          }

          return <SidebarItemView key={`${it.id}${it.color}`} item={it as LinkItemType} loopType="favorite" />;
        })}
      </>
    );
  }

  return (
    <>
      {linkState.links
        .filter((it) => {
          return (it as any).workspace === linkState.workspace;
        })
        .map((it) => {
          if (it.type === 'link' && it.linkType === 'heading') {
            return <HeadingItem key={`${it.id}${it.color}`} item={it} level={0} loopType="favorite" />;
          }

          return it.type === 'group' ? (
            <GroupView key={`${it.id}`} group={it} loopType="favorite" />
          ) : (
            <SidebarItemView key={`${it.id}${it.color}`} item={it} loopType="favorite" />
          );
        })}
    </>
  );
}
