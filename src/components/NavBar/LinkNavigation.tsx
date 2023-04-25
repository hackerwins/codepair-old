import React, { useCallback, useEffect, useState } from 'react';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { findCurrentPageLink, getCurrentWorkspace, ItemType, LinkItemType } from 'features/linkSlices';
import { Breadcrumbs, Chip } from '@mui/material';

import { makeStyles } from 'styles/common';
import Home from '@mui/icons-material/Home';
import Workspaces from '@mui/icons-material/Workspaces';
import { MimeType } from 'constants/editor';
import BorderAll from '@mui/icons-material/BorderAll';
import Gesture from '@mui/icons-material/Gesture';
import { DescriptionOutlined } from '@mui/icons-material';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.text.primary,
  },
  button: {
    height: '100%',
    color: theme.palette.text.primary,
    display: 'flex',
    gap: theme.spacing(1),
  },
  chip: {
    // backgroundColor: theme.palette.mode === Theme.Dark ? '#121212' : '#fff',
    // height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
}));

function getIcon(item: ItemType) {
  if (item.type === 'link') {
    switch (item.mimeType) {
      case MimeType.CELL:
        return <BorderAll fontSize="small" />;
      case MimeType.WHITEBOARD:
        return <Gesture fontSize="small" />;
      default:
        return <DescriptionOutlined fontSize="small" />;
    }
  }

  return <Home />;
}

export function LinkNavigation() {
  // const navigate = useNavigate();
  const { classes } = useStyles();
  const linkState = useSelector((state: AppState) => state.linkState);
  const currentItem = useSelector(findCurrentPageLink);
  const currentWorkspace = useSelector(getCurrentWorkspace(currentItem?.workspace));
  const [linkList, setLinkList] = useState<ItemType[]>([]);
  const { docKey } = useParams<{ docKey: string }>();

  const showTreeNode = useCallback(
    (id: string) => {
      const parentList: ItemType[] = [];

      function searchPath(data: unknown[], depth: number, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
          if (!data[i]) continue;
          parentList[depth] = data[i] as ItemType;
          parentList.length = depth + 1;
          if (callback(data[i])) {
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
        return item?.fileLink === id;
      });

      parentList.pop();
      setLinkList([...parentList]);
    },
    [linkState.links],
  );

  useEffect(() => {
    if (docKey) {
      showTreeNode(window.location.pathname);
    }
  }, [docKey, showTreeNode]);

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Chip
            className={classes.chip}
            label={currentWorkspace?.name}
            href="/"
            component="a"
            icon={<Workspaces fontSize="small" />}
          />
          {linkList.map((item) => (
            <Chip
              key={`${item?.id}${(item as LinkItemType)?.fileLink}`}
              className={classes.chip}
              label={item.name}
              href={`${(item as LinkItemType)?.fileLink}`}
              component="a"
              icon={getIcon(item)}
            />
          ))}
        </Breadcrumbs>
      </div>
    </div>
  );
}
