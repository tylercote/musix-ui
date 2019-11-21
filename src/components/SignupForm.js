import React from "react";
import Button from "@material-ui/core/Button";
import "./ConcertGrid.css";
import TextField from "@material-ui/core/TextField";

class SignupForm extends React.Component {
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

  render() {
    return (
      <div>
        <h2>Sign Up</h2>
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          label={"Username"}
          margin="normal"
          value={this.state.username}
          onChange={e => this.handleInputChange(e, "username")}
        />
        <TextField
          className={"inputWrapper"}
          InputProps={{
            className: "input"
          }}
          label={"Password"}
          margin="normal"
          value={this.state.password}
          onChange={e => this.handleInputChange(e, "password")}
        />
        <Button
          variant="contained"
          className={"loginButton"}
          onClick={e => this.props.handleSignup(e, this.state)}
        >
          Add
        </Button>
      </div>
    );
  }
}

export default SignupForm;
