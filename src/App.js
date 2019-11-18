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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContentWrapper from "./components/MySnackbarContentWrapper";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00FFFF"
    },
    secondary: {
      main: "#3a3a3a",
      light: "#eeeeee"
    },
    error: {
      main: "#FF0000",
      dark: "#FF0000"
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
  constructor(props) {
    super(props);
    this.state = {
      successOpen: false,
      errorOpen: false,
      snackbarMessage: "",
      snackbarVariant: ""
    };
    this.openSnackbar = this.openSnackbar.bind(this);
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ successOpen: false, errorOpen: false });
  }

  openSnackbar(type, message) {
    if (type === "success") {
      this.setState({
        snackbarVariant: "success",
        snackbarMessage: message,
        successOpen: true
      });
    } else if (type === "error") {
      console.log("error displayed");
      this.setState({
        snackbarVariant: "error",
        snackbarMessage: message,
        errorOpen: true
      });
    }
  }

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
                <ConcertGrid openSnackbar={this.openSnackbar} />
              </Route>
              <Route path="/concert-entry">
                <ConcertEntry openSnackbar={this.openSnackbar} />
              </Route>
              <Route path="/festival-entry">
                <FestivalEntry openSnackbar={this.openSnackbar} />
              </Route>
              <Route path="/manual-entry">
                <ManualEntry />
              </Route>
            </Switch>
          </Router>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.state.successOpen}
            autoHideDuration={3000}
            onClose={this.handleClose.bind(this)}
          >
            <SnackbarContentWrapper
              onClose={this.handleClose.bind(this)}
              variant={"success"}
              message={this.state.snackbarMessage}
            />
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.state.errorOpen}
            autoHideDuration={3000}
            onClose={this.handleClose.bind(this)}
          >
            <SnackbarContentWrapper
              onClose={this.handleClose.bind(this)}
              variant={"error"}
              message={this.state.snackbarMessage}
            />
          </Snackbar>
        </ThemeProvider>
      </div>
    );
  }
}
export default App;
