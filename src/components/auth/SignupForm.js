import React from "react";
import Button from "@material-ui/core/Button";
import "../home/ConcertGrid.css";
import TextField from "@material-ui/core/TextField";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: ""
    };
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {}

  validateFields(e) {
    let emailValid = this.validateEmail(this.state.email);
    if (emailValid) {
      this.props.handleSignup(e, this.state);
    } else {
      this.setState({ email: "" });
      this.props.openSnackbar("error", "Please enter a valid email address.");
    }
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleInputChange(event, field) {
    if (field === "username") {
      this.setState({ username: event.target.value });
    } else if (field === "password") {
      this.setState({ password: event.target.value });
    } else if (field === "email") {
      this.setState({ email: event.target.value });
    } else if (field === "first_name") {
      this.setState({ first_name: event.target.value });
    } else if (field === "last_name") {
      this.setState({ last_name: event.target.value });
    }
  }

  render() {
    return (
      <div>
        <TextField
          className={"inputWrapper"}
          style={{ float: "left", width: "47%" }}
          InputProps={{
            className: "input"
          }}
          variant={"outlined"}
          label={"First Name"}
          margin="normal"
          value={this.state.first_name}
          onChange={(e) => this.handleInputChange(e, "first_name")}
        />
        <TextField
          className={"inputWrapper"}
          style={{ float: "right", width: "47%" }}
          InputProps={{
            className: "input"
          }}
          variant={"outlined"}
          label={"Last Name"}
          margin="normal"
          value={this.state.last_name}
          onChange={(e) => this.handleInputChange(e, "last_name")}
        />
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          fullWidth={true}
          variant={"outlined"}
          label={"Username"}
          margin="normal"
          value={this.state.username}
          onChange={(e) => this.handleInputChange(e, "username")}
        />
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          fullWidth={true}
          variant={"outlined"}
          type={"email"}
          label={"Email"}
          margin="normal"
          value={this.state.email}
          onChange={(e) => this.handleInputChange(e, "email")}
        />
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          fullWidth={true}
          type={"password"}
          variant={"outlined"}
          label={"Password"}
          margin="normal"
          value={this.state.password}
          onChange={(e) => this.handleInputChange(e, "password")}
        />
        <Button
          variant="contained"
          className={"loginButton"}
          onClick={this.validateFields}
        >
          Sign Up
        </Button>
        <h6
          className={"createAccountLink"}
          onClick={(e) => this.props.toggleLoginSignup()}
        >
          Have an account? Login!
        </h6>
      </div>
    );
  }
}

export default SignupForm;
