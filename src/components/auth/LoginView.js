import React from "react";
import Grid from "@material-ui/core/Grid";
import "./LoginView.css";
import { Paper } from "@material-ui/core";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLogin: true
    };
    this.toggleLoginSignup = this.toggleLoginSignup.bind(this);
    this.canvasRef = React.createRef();
  }

  toggleLoginSignup() {
    this.setState({ showingLogin: !this.state.showingLogin });
  }

  render() {
    return (
      <div className={"paperWrapper"}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={5} style={{ zIndex: 1 }}>
            <Paper className={"paperLogin"}>
              <h1 className={"siteTitle"} style={{ marginBottom: "30px" }}>
                <i className="fas fa-headphones-alt headphones-logo"></i>
                Musix
              </h1>
              {this.state.showingLogin ? (
                <LoginForm
                  handleLogin={this.props.handleLogin}
                  toggleLoginSignup={this.toggleLoginSignup}
                />
              ) : (
                <SignupForm
                  handleSignup={this.props.handleSignup}
                  toggleLoginSignup={this.toggleLoginSignup}
                  openSnackbar={this.props.openSnackbar}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default LoginView;
