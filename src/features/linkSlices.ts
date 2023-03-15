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
  opens: OpenState;
  groups: GroupType[];
}

const SettingModel = new BrowserStorage<LinkState>('$$codepair$$link');

const initialLinkState: LinkState = SettingModel.getValue({
  openTab: false,
  groups: [],
  opens: {},
});

function traverse(parent: any, data: any[], callback: (item: any, parent: any) => void) {
  data.forEach((item) => {
    callback(item, parent);
    traverse(item, item.links || [], callback);
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

const linkSlice = createSlice({
  name: 'link',
  initialState: initialLinkState,

  reducers: {
    toggleLinkTab(state) {
      state.openTab = !state.openTab;

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
          parent.links = parent.links.filter((link: any) => link.id !== id);
        }
      });

      SettingModel.setValue(state);
    },

    removeGroup(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      traverse(state, state.groups, (item, parent) => {
        if (item.id === id) {
          parent.links = parent.links.filter((link: any) => link.id !== id);
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

      traverse(state, state.groups, (item) => {
        const temp = item;

        if (item.id === parentId) {
          if (!temp.links) temp.links = [];
          temp.links = [
            ...temp.links,
            {
              id: `${Date.now()}`,
              name,
              fileLink,
              linkType: 'pairy',
            },
          ];
        }
      });

      SettingModel.setValue(state);
    },
  },
});

export const {
  toggleLinkTab,
  toggleLinkOpen,
  setLinkName,
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
