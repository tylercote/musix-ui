import React from "react";
import "./App.css";
import "typeface-roboto";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from "axios";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { PrivateRoute } from "./components/PrivateRoute";
import LoginView from "./components/auth/LoginView";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContentWrapper from "./components/MySnackbarContentWrapper";
import HomeView from "./components/home/HomeView";
import jwt from "jsonwebtoken";
import LinesBackground from "./components/auth/LinesBackground";

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
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    let token = localStorage.getItem("token");

    jwt.verify(
      token,
      "-1izvs+(!mx%vx8qh^_(d(d1la38x_hmg7(q5mq#fk%48)tpir",
      function(err, decoded) {
        if (err && err.name === "TokenExpiredError") {
          this.handleLogout();
        }
      }.bind(this)
    );

    if (this.state.loggedIn) {
      fetch("http://localhost:8000/current_user/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`
        }
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("Change state 103");
          this.setState({ username: json.username });
        });
    }
  }

  handleLogin(e, data, onFail) {
    e.preventDefault();
    axios
      .post("http://localhost:8000/token-auth/", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.user.id);
          localStorage.setItem("username", res.data.user.username);
          console.log("Change state 129");
          this.setState({
            loggedIn: true,
            displayed_form: "",
            username: res.data.user.username
          });
        }
      })
      .catch((res) => {
        this.openSnackbar("error", "Incorrect login. Please try again.");
        // onFail();
      });
  }

  handleSignup(e, data) {
    e.preventDefault();
    axios
      .post("http://localhost:8000/users/", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
        this.setState({
          loggedIn: true,
          displayed_form: "",
          username: res.data.username
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
            {this.state.loggedIn ? (
              <Redirect to={"/"} />
            ) : (
              <Redirect to={"/login"} />
            )}
            {!this.state.loggedIn ? <LinesBackground /> : null}
            <Switch>
              <PrivateRoute
                loggedIn={this.state.loggedIn}
                path="/"
                exact
                component={() => (
                  <HomeView
                    handleLogout={this.handleLogout}
                    openSnackbar={this.openSnackbar}
                  />
                )}
              />
              <Route
                path="/login"
                component={() => (
                  <div style={{ height: "100%" }}>
                    <LoginView
                      handleLogin={this.handleLogin}
                      handleSignup={this.handleSignup}
                      openSnackbar={this.openSnackbar}
                    />
                  </div>
                )}
              />
            </Switch>
          </Router>
          {/*<CustomizedSnackbar open={}/>*/}
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
