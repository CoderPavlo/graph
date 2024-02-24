import React from 'react'
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export interface ITheme {
  children: React.ReactNode,
}

function ThemeComponent(props: ITheme): React.JSX.Element {

  const theme: Theme = React.useMemo(
    () =>
      createTheme({
        palette: {
            primary: {
                main: '#1ea54c',
              },
              secondary: {
                main: '#1b2631',
              },
              background: {
                default: '#24313c',
                paper: '#2e3d47',
              },
              error: {
                main: '#FF5733', // Червоний (Accent Color)
              },
              success: {
                main: '#28A745', // Зелений (Positive Action Color)
              },
              warning: {
                main: '#FFC107', // Помаранчевий (Warning Color)
              },
              text: {
                primary: '#FFFFFF', // Білий (Text Color)
                secondary: '#727f85'
              },
              common: {
                white: '#FFFFFF', // Білий (Background Color)
              },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  )
}

export default ThemeComponent