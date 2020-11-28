import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiSvgIcon: {
      root: {
        cursor: 'pointer',
        opacity: 0.8,
        transition: '0.3s',
        '&:hover': {
          opacity: 1,
        },
      },
    },
  },
});

export default theme;
