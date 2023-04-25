import React, { ReactNode } from 'react';
import { Box, ListSubheader, Typography } from '@mui/material';

type TabPanelHeaderProps = {
  children: ReactNode;
  tools?: ReactNode;
  onClick?: () => void;
};

export function TabPanelHeader({ children, tools = '', onClick }: TabPanelHeaderProps) {
  return (
    <ListSubheader
      style={{
        backgroundColor: 'inherit',
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" onClick={onClick}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 400,
            fontSize: 14,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 auto',
            cursor: 'pointer',
          }}
        >
          {children}
        </Typography>
        {tools}
      </Box>
    </ListSubheader>
  );
}

TabPanelHeader.defaultProps = {
  tools: '',
};
