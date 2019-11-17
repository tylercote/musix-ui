import React from "react";
import "./App.css";
import "typeface-roboto";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ConcertGrid from "./components/ConcertGrid";
import FestivalEntry from "./components/FestivalEntry";
import ConcertEntry from "./components/ConcertEntry";
import ManualEntry from "./components/ManualEntry";
import Grid from "@material-ui/core/Grid";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00FFFF"
    },
    secondary: {
      main: "#3a3a3a",
      light: "#eeeeee"
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: "relative",
        "& $notchedOutline": {
          borderColor: "#eeeeee"
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "aqua",
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            borderColor: "aqua"
          }
        },
        "&$focused $notchedOutline": {
          borderColor: "aqua",
          borderWidth: 2
        }
      }
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "aqua"
        },
        color: "#eeeeee"
      }
    }
  }
});

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <Router>
            <Grid
              className={"headerContainer"}
              container
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs={4}>
                <NavLink exact to="/" className="navButton">
                  <h1 className={"siteTitle"}>
                    <i className="fas fa-headphones-alt headphones-logo"></i>
                    Musix
                  </h1>
                </NavLink>
              </Grid>
              <Grid item xs>
                <NavLink
                  className="navButton"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "3px solid aqua",
                    paddingBottom: "5px"
                  }}
                  exact
                  to="/"
                >
                  View my Concerts
                </NavLink>
              </Grid>
              <Grid item xs>
                <NavLink
                  className="navButton"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "3px solid aqua",
                    paddingBottom: "5px"
                  }}
                  to="/concert-entry"
                >
                  Enter a Concert
                </NavLink>
              </Grid>
              <Grid item xs>
                <NavLink
                  className="navButton"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "3px solid aqua",
                    paddingBottom: "5px"
                  }}
                  to="/festival-entry"
                >
                  Enter a Festival
                </NavLink>
              </Grid>
              <Grid item xs>
                <NavLink
                  className="navButton"
                  activeStyle={{
                    fontWeight: "bold",
                    borderBottom: "3px solid aqua",
                    paddingBottom: "5px"
                  }}
                  to="/manual-entry"
                >
                  Manual Entry
                </NavLink>
              </Grid>
            </Grid>
            <Switch>
              <Route exact path="/">
                <ConcertGrid />
              </Route>
              <Route path="/concert-entry">
                <ConcertEntry />
              </Route>
              <Route path="/festival-entry">
                <FestivalEntry />
              </Route>
              <Route path="/manual-entry">
                <ManualEntry />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </div>
    );
  }
}
export default App;
