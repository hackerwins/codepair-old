import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MimeType } from 'constants/editor';
import { getTableOfContents } from './docSlices';
import { AppState } from '../app/rootReducer';
import BrowserStorage from '../utils/storage';

export type ItemType = LinkItemType | GroupType;

export interface LinkItemType {
  type: 'link';
  level?: number;
  id: string;
  name: string;
  mimeType?: MimeType;
  fileLink?: string;
  linkType?: string;
  links?: ItemType[];
}

export interface GroupType {
  type: 'group';
  id: string;
  name: string;
  links: ItemType[];
}

export interface OpenState {
  [key: string]: boolean;
}

export interface LinkState {
  opens: OpenState;
  favorite: (string | LinkItemType)[];
  links: ItemType[];
}

function traverse<T>(parent: unknown, data: T[], callback: (item: T, parent: T, depth: number) => void, depth = 0) {
  data.filter(Boolean).forEach((item) => {
    callback(item, parent as T, depth + 1);
    if (!item) return;
    traverse(item, (item as any).links || [], callback, depth + 1);
  });
}

function findOne(data: any[], callback: (item: any) => boolean) {
  let result: any = null;
  traverse(null, data.filter(Boolean), (item) => {
    if (callback(item)) {
      result = item;
    }
  });
  return result;
}

function copyTextToClipboard(text: string) {
  window.navigator.clipboard.writeText(text);
}

const SettingModel = new BrowserStorage<LinkState>('$$codepair$$link');

const initialLinkState: LinkState = SettingModel.getValue({
  favorite: [],
  links: [],
  opens: {},
});

// rename groups to links
if ((initialLinkState as any).groups?.length > 0) {
  initialLinkState.links = (initialLinkState as any).groups || [];
}
delete (initialLinkState as any).groups;

// recover old data
traverse<ItemType>(initialLinkState, initialLinkState.links, (item) => {
  const currentItem = item as LinkItemType;
  if (!item) return;
  if (currentItem.type === 'link') {
    if (currentItem.fileLink?.startsWith('/') !== true) {
      currentItem.fileLink = `/${currentItem.fileLink}`;
    }
  } else if (currentItem.linkType === 'pairy') {
    if (currentItem.fileLink?.startsWith('/') !== true) {
      currentItem.fileLink = `/${currentItem.fileLink}`;
    }
    currentItem.type = 'link';
  }
});

const linkSlice = createSlice({
  name: 'link',
  initialState: initialLinkState,

  reducers: {
    refreshStorage(state) {
      const newValue = SettingModel.getValue(state);

      state.favorite = newValue.favorite;
      state.links = (newValue as any).groups || [];
      state.links = state.links.concat(newValue.links || []);
      state.opens = newValue.opens;
    },
    toggleFavorite(state, action: PayloadAction<string | LinkItemType>) {
      const { payload } = action;

      let favorite = state.favorite || [];

      if (typeof payload === 'string') {
        if (!favorite.includes(payload)) {
          favorite.push(payload);
        } else {
          favorite = favorite.filter((id) => id !== payload);
        }
      } else if (typeof payload === 'object') {
        const { fileLink } = payload;

        if (!favorite.some((item) => (item as any)?.fileLink === fileLink)) {
          favorite.push(payload);
        } else {
          favorite = favorite.filter((item) => (item as any)?.fileLink === fileLink);
        }
      }

      state.favorite = favorite;

      SettingModel.setValue(state);
    },

    toggleLinkOpen(state, action: PayloadAction<string>) {
      const { payload } = action;
      state.opens[payload] = !state.opens[payload];

      if (state.opens[payload] === false) {
        delete state.opens[payload];
      }

      SettingModel.setValue(state);
    },
    removeLink(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      traverse(state, state.links, (item, parent) => {
        if (item.id === id) {
          parent.links = parent.links?.filter((link: any) => link.id !== id) || [];
        }
      });

      SettingModel.setValue(state);
    },

    setLinkOpens(state, action: PayloadAction<OpenState>) {
      state.opens = {
        ...state.opens,
        ...action.payload,
      };

      SettingModel.setValue(state);
    },
    setLinkName(state, action: PayloadAction<{ id: string; name: string }>) {
      const { id, name } = action.payload;
      const foundItem = findOne(state.links, (item) => item.id === id);
      if (foundItem) {
        foundItem.name = name;
      }

      SettingModel.setValue(state);
    },
    updateLinkNameWithHeading(state) {
      const heading = getTableOfContents(1)[0];
      const currentLink = window.location.pathname;

      if (!heading) return;

      // const { id, name } = action.payload;
      const foundItem = findOne(state.links, (item) => {
        return item.fileLink === currentLink;
      });
      if (foundItem) {
        foundItem.name = heading.text;
      }

      SettingModel.setValue(state);
    },
    setLinkFileLink(state, action: PayloadAction<{ id: string; name: string; fileLink: string }>) {
      const { id, name, fileLink } = action.payload;
      const foundItem = findOne(state.links, (item) => item.id === id);
      if (foundItem) {
        foundItem.fileLink = fileLink;
        foundItem.name = name;
      }

      SettingModel.setValue(state);
    },
    newLink(state, action: PayloadAction<{ parentId: string; name: string; mimeType?: string; fileLink?: string }>) {
      const { parentId, name, fileLink, mimeType = 'text/markdown' } = action.payload;

      const newLinkInfo = {
        type: 'link',
        id: `${Date.now()}`,
        name,
        mimeType,
        fileLink: fileLink || `/${Math.random().toString(36).substring(7)}`,
        linkType: 'pairy',
        links: [],
      };

      let checkParentId = false;

      traverse<ItemType>(state, state.links, (item) => {
        const temp = item;

        if (item.id === parentId) {
          if (!temp.links) temp.links = [];
          temp.links = [...temp.links, newLinkInfo] as ItemType[];

          state.opens[parentId] = true;
          checkParentId = true;
        }
      });

      // add root node if not found parent id
      if (!checkParentId) {
        state.links = [...state.links, newLinkInfo] as ItemType[];
      }

      SettingModel.setValue(state);

      window.location.replace(newLinkInfo.fileLink);
    },

    moveLink(
      state,
      action: PayloadAction<{
        id: string;
        updateAction: 'after' | 'before' | 'child';
        targetId: string;
      }>,
    ) {
      const { id, updateAction, targetId } = action.payload;

      let oldParent: ItemType | null = null;
      let currentItem: ItemType | null = null;

      traverse<ItemType>(state, state.links, (item, parent) => {
        if (item.id === id) {
          oldParent = parent;
          currentItem = item;
        }
      });

      if (oldParent) {
        const tempOldParent = oldParent as ItemType;
        tempOldParent.links = tempOldParent.links?.filter((link: any) => link.id !== id) || [];
      }

      if (updateAction === 'after') {
        let newParentId = '';
        traverse(state, state.links, (item, parent) => {
          if (item.id === targetId) {
            newParentId = parent.id;
          }
        });

        const newParent = findOne(state.links, (item) => item.id === newParentId) || state;
        if (newParent) {
          const targetIndex = newParent.links.findIndex((link: any) => link.id === targetId);
          newParent.links.splice(targetIndex + 1, 0, currentItem);
        }
      } else if (updateAction === 'before') {
        let newParentId = '';
        traverse(state, state.links, (item, parent) => {
          if (item.id === targetId) {
            newParentId = parent.id;
          }
        });

        const newParent = findOne(state.links, (item) => item.id === newParentId) || state;
        if (newParent) {
          const targetIndex = newParent.links.findIndex((link: any) => link.id === targetId);

          newParent.links.splice(targetIndex, 0, currentItem);
        }
      } else if (updateAction === 'child') {
        const newParent = findOne(state.links, (item) => item.id === targetId);
        if (newParent) {
          newParent.links = [...(newParent.links || []), currentItem] as ItemType[];
        }
      }

      SettingModel.setValue(state);
    },

    newLinkByCurrentPage(state, action: PayloadAction<{ parentId: string; name: string; fileLink: string }>) {
      const { parentId, name, fileLink } = action.payload;

      const foundItem = findOne(state.links, (item) => item.id === parentId);

      if (foundItem) {
        if (!foundItem.links) foundItem.links = [];
        foundItem.links = [
          ...foundItem.links,
          {
            type: 'link',
            id: `${Date.now()}`,
            name,
            fileLink,
            linkType: 'pairy',
          },
        ];

        state.opens[parentId] = true;
      }

      SettingModel.setValue(state);

      window.location.replace(fileLink);
    },
    copyMarkdownTextForGroup(state, action: PayloadAction<string>) {
      const id = action.payload;

      const foundItem = findOne(state.links, (item) => item.id === id);

      if (foundItem) {
        const list: {
          item: ItemType;
          depth: number;
        }[] = [
          {
            item: foundItem,
            depth: 0,
          },
        ];
        traverse<ItemType>(foundItem, foundItem.links, (item, _, depth) => {
          list.push({ item, depth });
        });

        const text = list
          .map((it) => {
            const { item, depth } = it;
            const prefix = '  '.repeat(depth);

            if (item.type === 'group') {
              return `${prefix}- ${item.name}`;
            }

            return `${prefix}- [${item.name}](${item.fileLink})`;
          })
          .join('\n');

        copyTextToClipboard(text);
      }
    },
  },
});

export function favoriteSelector(state: AppState): ItemType[] {
  return (
    state.linkState.favorite?.map((id) => {
      if (typeof id !== 'string') {
        return id;
      }

      return findOne(state.linkState.links, (item) => item.id === id);
    }) || []
  );
}

export function recentFavoriteSelector(count = 10) {
  return (state: AppState): LinkItemType[] => {
    return (
      state.linkState.favorite?.map((id) => {
        if (typeof id !== 'string') {
          return id;
        }

        return findOne(state.linkState.links, (item) => item.id === id);
      }) || []
    )
      .filter((item) => item?.fileLink)
      .reverse()
      .filter((_, index) => index < count);
  };
}

export function findCurrentPageLink(state: AppState): LinkItemType {
  const { pathname } = window.location;
  return findOne(state.linkState.links, (item) => {
    return item?.fileLink === pathname;
  });
}

export const {
  refreshStorage,
  copyMarkdownTextForGroup,
  toggleFavorite,
  toggleLinkOpen,
  setLinkName,
  updateLinkNameWithHeading,
  newLinkByCurrentPage,
  setLinkFileLink,
  removeLink,
  newLink,
  moveLink,
  setLinkOpens,
} = linkSlice.actions;
export default linkSlice.reducer;
