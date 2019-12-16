import React from "react";
import "../../App.css";
import "typeface-roboto";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import ConcertGrid from "./ConcertGrid";
import FestivalEntry from "./FestivalEntry";
import ConcertEntry from "./ConcertEntry";
import Grid from "@material-ui/core/Grid";
import "./HomeView.css";

class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: "",
      username: ""
    };
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ successOpen: false, errorOpen: false });
  }

  render() {
    return (
      <Router>
        <Grid
          className={"headerContainer"}
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <Grid item xs={4}>
            <NavLink exact to="/" className="siteTitleLink">
              <h1 className={"siteTitle"}>
                <i className="fas fa-headphones-alt headphones-logo"></i>
                Musix
              </h1>
            </NavLink>
          </Grid>
          <Grid item xs className={"navWrapper"}>
            <NavLink
              className="navButton"
              activeStyle={{
                fontWeight: "bold",
                borderBottom: "3px solid aqua",
                height: "96%"
              }}
              exact
              to="/"
            >
              <span className={"linkTextWrapper"}>VIEW MY CONCERTS</span>
            </NavLink>
          </Grid>
          <Grid item xs className={"navWrapper"}>
            <NavLink
              className="navButton"
              activeStyle={{
                fontWeight: "bold",
                borderBottom: "3px solid aqua",
                height: "96%"
              }}
              to="/concert-entry"
            >
              <span className={"linkTextWrapper"}>ENTER A CONCERT</span>
            </NavLink>
          </Grid>
          <Grid item xs className={"navWrapper"}>
            <NavLink
              className="navButton"
              activeStyle={{
                fontWeight: "bold",
                borderBottom: "3px solid aqua",
                height: "96%"
              }}
              to="/festival-entry"
            >
              <span className={"linkTextWrapper"}>ENTER A FESTIVAL</span>
            </NavLink>
          </Grid>
          <div className={"authButtons"}>
            <i className="fas fa-user-alt" />
            <span>{localStorage.getItem("username")}</span>
            <NavLink to="/login" onClick={() => this.props.handleLogout()}>
              Logout
            </NavLink>
          </div>
        </Grid>
        <Switch>
          <Route exact path="/">
            <ConcertGrid openSnackbar={this.props.openSnackbar} />
          </Route>
          <Route path="/concert-entry">
            <ConcertEntry openSnackbar={this.props.openSnackbar} />
          </Route>
          <Route path="/festival-entry">
            <FestivalEntry openSnackbar={this.props.openSnackbar} />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default HomeView;
