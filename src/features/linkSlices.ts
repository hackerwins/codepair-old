import { getTableOfContents } from 'features/docSlices';
import { AppState } from 'app/rootReducer';
import BrowserStorage from 'utils/storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ItemType = LinkItemType | GroupType;

export interface LinkItemType {
  type: 'link';
  level?: number;
  id: string;
  name: string;
  fileLink?: string;
  linkType?: string;
  links?: LinkItemType[];
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
  openTab: boolean;
  openTabValue: TabValueType;
  opens: OpenState;
  favorite: (string | LinkItemType)[];
  groups: GroupType[];
}

export type TabValueType = 'all' | 'links' | 'toc';

const SettingModel = new BrowserStorage<LinkState>('$$codepair$$link');

const initialLinkState: LinkState = SettingModel.getValue({
  openTab: false,
  openTabValue: 'links',
  favorite: [],
  groups: [
    {
      type: 'group',
      id: `${Date.now()}`,
      name: 'Default Group',
      links: [],
    },
  ],
  opens: {},
});

function traverse(parent: any, data: any[], callback: (item: any, parent: any, depth: number) => void, depth = 0) {
  data.forEach((item) => {
    callback(item, parent, depth + 1);
    traverse(item, item.links || [], callback, depth + 1);
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

function copyTextToClipboard(text: string) {
  window.navigator.clipboard.writeText(text);
}

const linkSlice = createSlice({
  name: 'link',
  initialState: initialLinkState,

  reducers: {
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
    toggleLinkTab(state, action: PayloadAction<TabValueType>) {
      const tabValue = action.payload || 'links';

      if (tabValue === 'all') {
        if (state.openTab) {
          state.openTab = false;
          SettingModel.setValue(state);
          return;
        }

        state.openTab = true;
        SettingModel.setValue(state);

        return;
      }

      if (state.openTabValue === tabValue) {
        state.openTab = !state.openTab;
        SettingModel.setValue(state);
        return;
      }

      state.openTab = true;
      state.openTabValue = tabValue;

      SettingModel.setValue(state);
    },

    setTabValue(state, action: PayloadAction<TabValueType>) {
      const tabValue = action.payload || 'links';

      state.openTabValue = tabValue;
      SettingModel.setValue(state);
    },

    toggleLinkOpen(state, action: PayloadAction<string>) {
      const { payload } = action;
      state.opens[payload] = !state.opens[payload];

      SettingModel.setValue(state);
    },
    removeLink(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      traverse(state, state.groups, (item, parent) => {
        if (item.id === id) {
          parent.links = parent.links?.filter((link: any) => link.id !== id) || [];
        }
      });

      SettingModel.setValue(state);
    },

    removeGroup(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      traverse(state, state.groups, (item, parent) => {
        if (item.id === id) {
          if (parent?.links) {
            parent.links = parent.links.filter((link: any) => link.id !== id);
          } else {
            // root object

            if (state.groups.length < 2) {
              return;
            }

            parent.groups = parent.groups.filter((link: any) => link.id !== id);
          }
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
      const foundItem = findOne(state.groups, (item) => item.id === id);
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
      const foundItem = findOne(state.groups, (item) => {
        return item.fileLink === currentLink;
      });
      if (foundItem) {
        foundItem.name = heading.text;
      }

      SettingModel.setValue(state);
    },
    setLinkFileLink(state, action: PayloadAction<{ id: string; name: string; fileLink: string }>) {
      const { id, name, fileLink } = action.payload;
      const foundItem = findOne(state.groups, (item) => item.id === id);
      if (foundItem) {
        foundItem.fileLink = fileLink;
        foundItem.name = name;
      }

      SettingModel.setValue(state);
    },
    newGroup(state, action: PayloadAction<string>) {
      const { payload } = action;
      state.groups = [
        ...state.groups,
        {
          type: 'group',
          id: `${Date.now()}`,
          name: payload,
          links: [],
        },
      ];

      SettingModel.setValue(state);
    },
    newGroupAt(state, action: PayloadAction<{ id: string; name: string }>) {
      const { payload } = action;

      const newGroups: GroupType[] = [];
      state.groups.forEach((group) => {
        newGroups.push(group);
        if (group.id === payload.id) {
          newGroups.push({
            type: 'group',
            id: `${Date.now()}`,
            name: payload.name,
            links: [],
          });
        }
      });

      state.groups = newGroups;

      SettingModel.setValue(state);
    },
    newChildGroupAt(state, action: PayloadAction<{ parentId: string; name: string }>) {
      const { payload } = action;

      const foundGroupItem = findOne(state.groups, (item) => item.id === payload.parentId);

      if (foundGroupItem) {
        const newGroup = {
          type: 'group',
          id: `${Date.now()}`,
          name: payload.name,
          links: [],
        };

        foundGroupItem.links = [...foundGroupItem.links, newGroup];

        state.opens[payload.parentId] = true;
      }

      SettingModel.setValue(state);
    },
    newLink(state, action: PayloadAction<{ parentId: string; name: string }>) {
      const { parentId, name } = action.payload;

      traverse(state, state.groups, (item) => {
        const temp = item;

        if (item.id === parentId) {
          if (!temp.links) temp.links = [];
          temp.links = [
            ...temp.links,
            {
              id: `${Date.now()}`,
              name,
              fileLink: `${Math.random().toString(36).substring(7)}`,
              linkType: 'pairy',
            },
          ];

          state.opens[parentId] = true;
        }
      });

      SettingModel.setValue(state);
    },
    newLinkByCurrentPage(state, action: PayloadAction<{ parentId: string; name: string; fileLink: string }>) {
      const { parentId, name, fileLink } = action.payload;

      const foundItem = findOne(state.groups, (item) => item.id === parentId);

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
    },
    copyMarkdownTextForGroup(state, action: PayloadAction<string>) {
      const id = action.payload;

      const foundItem = findOne(state.groups, (item) => item.id === id);

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
        traverse(foundItem, foundItem.links, (item, _, depth) => {
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

      return findOne(state.linkState.groups, (item) => item.id === id);
    }) || []
  );
}

export const {
  copyMarkdownTextForGroup,
  toggleFavorite,
  setTabValue,
  toggleLinkTab,
  toggleLinkOpen,
  setLinkName,
  updateLinkNameWithHeading,
  newLinkByCurrentPage,
  setLinkFileLink,
  removeLink,
  removeGroup,
  newLink,
  setLinkOpens,
  newGroup,
  newGroupAt,
  newChildGroupAt,
} = linkSlice.actions;
export default linkSlice.reducer;
