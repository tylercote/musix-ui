import { Redirect, Route } from "react-router";
import React from "react";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("User is logged in: ", this.props.loggedIn);
    return (
      <Route
        {...this.props}
        render={({ location }) =>
          this.props.loggedIn ? (
            this.props.children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
