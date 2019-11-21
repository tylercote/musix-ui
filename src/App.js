import React from "react";
import "./App.css";
import "typeface-roboto";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "./components/PrivateRoute";
import LoginView from "./components/LoginView";
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
      displayed_form: "",
      loggedIn: !!localStorage.getItem("token"),
      username: "",
      successOpen: false,
      errorOpen: false,
      snackbarMessage: "",
      snackbarVariant: ""
    };
    this.openSnackbar = this.openSnackbar.bind(this);
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      fetch("http://localhost:8000/current_user/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handleLogin(e, data) {
    e.preventDefault();
    fetch("http://localhost:8000/token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem("token", json.token);
        this.setState({
          loggedIn: true,
          displayed_form: "",
          username: json.user.username
        });
      });
  }

  handleSignup(e, data) {
    e.preventDefault();
    fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem("token", json.token);
        this.setState({
          loggedIn: true,
          displayed_form: "",
          username: json.username
        });
      });
  }

  handleLogout() {
    localStorage.removeItem("token");
    this.setState({ loggedIn: false, username: "" });
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
    // let history = useHistory();

    return this.state.loggedIn ? (
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
              <div className={"authButtons"}>
                <NavLink to="/login" onClick={() => this.handleLogout()}>
                  Logout
                </NavLink>
              </div>
            </Grid>
            <Switch>
              <PrivateRoute exact path="/" loggedIn={this.state.loggedIn}>
                <ConcertGrid openSnackbar={this.openSnackbar} />
              </PrivateRoute>
              <PrivateRoute
                path="/concert-entry"
                loggedIn={this.state.loggedIn}
              >
                <ConcertEntry openSnackbar={this.openSnackbar} />
              </PrivateRoute>
              <PrivateRoute
                path="/festival-entry"
                loggedIn={this.state.loggedIn}
              >
                <FestivalEntry openSnackbar={this.openSnackbar} />\{" "}
              </PrivateRoute>
              <PrivateRoute path="/manual-entry" loggedIn={this.state.loggedIn}>
                <ManualEntry />
              </PrivateRoute>
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
    ) : (
      <LoginView handleLogin={this.handleLogin} />
    );
  }
}
export default App;
