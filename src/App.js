import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles"; 
import Header from "./components/Header/Header";
import List from "./components/Search/Search";

// Create a theme 
const theme = createTheme({
  palette: {
    primary: {
      main: "#202124",  
    },
    secondary: {
      main: "#1D72B8",  
    },
    background: {
      default: "#202124",  
      paper: "#333",       
    },
  },
});

/**
 * App component, the main entry point for the application.
 *
 * This component renders the main <Header> and <List> components.
 *
 * @return {ReactElement} The main application component.
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}> 
      <Header />
      <List />
    </ThemeProvider>
  );
};

export default App;
