import React from "react";
import Grid from "@material-ui/core/Grid";
import "./ConcertGrid.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Paper } from "@material-ui/core";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLogin: true
    };
  }

  componentDidMount() {}

  render() {
    // let history = useHistory();
    // let location = useLocation();
    // let { from } = location.state || { from: { pathname: "/" } };
    return (
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12}>
          <Paper className={"paperContainer"}>
            {this.state.showingLogin ? (
              <LoginForm handleLogin={this.props.handleLogin} />
            ) : (
              <SignupForm handleSignup={this.props.handleSignup} />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default LoginView;
