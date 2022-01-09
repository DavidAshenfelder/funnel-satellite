// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import "./App.css";
import Dashboard from './Dashboard';
import { createTheme, ThemeProvider } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#f700ff',
    },
    secondary: {
      main: '#ce24e6',
    },
  },
});

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header">
          <SatelliteAltIcon fontSize="inherit" className="App-logo" />
        </header>
        <Dashboard/>
      </ThemeProvider>
    </div>
  );
}

export default App;
