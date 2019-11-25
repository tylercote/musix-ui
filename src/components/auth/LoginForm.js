import React from "react";
import Button from "@material-ui/core/Button";
import "./LoginForm.css";
import TextField from "@material-ui/core/TextField";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  componentDidMount() {}

  handleInputChange(event, field) {
    if (field === "username") {
      this.setState({ username: event.target.value });
    } else if (field === "password") {
      this.setState({ password: event.target.value });
    }
  }

  // onLoginFailed() {
  //   this.setState({ username: "", password: "" });
  // }

  render() {
    return (
      <div>
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          fullWidth={true}
          variant={"outlined"}
          label={"Username / Email"}
          margin="normal"
          value={this.state.email}
          onChange={(e) => this.handleInputChange(e, "username")}
        />
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          fullWidth={true}
          variant={"outlined"}
          label={"Password"}
          type={"password"}
          margin="normal"
          value={this.state.password}
          onChange={(e) => this.handleInputChange(e, "password")}
        />
        <Button
          variant="contained"
          className={"loginButton"}
          onClick={(e) => this.props.handleLogin(e, this.state)}
        >
          Login
        </Button>
        <h6
          className={"createAccountLink"}
          onClick={(e) => this.props.toggleLoginSignup()}
        >
          Don't have an account? Sign up!
        </h6>
      </div>
    );
  }
}

export default LoginForm;
