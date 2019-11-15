import React from "react";
import "./App.css";
import "typeface-roboto";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import ConcertList from "./components/ConcertList";
import FestivalEntry from "./components/FestivalEntry";
import ConcertEntry from "./components/ConcertEntry";
import ManualEntry from "./components/ManualEntry";
import Grid from "@material-ui/core/Grid";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Grid
            className={"headerContainer"}
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={12}>
              <h1 className={"siteTitle"}>My Musix</h1>
            </Grid>
            <Grid item xs>
              <NavLink
                className="navButton"
                activeStyle={{
                  fontWeight: "bold",
                  borderBottom: "5px solid aqua",
                  paddingBottom: "9px",
                  paddingLeft: "30px",
                  paddingRight: "30px"
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
                  borderBottom: "5px solid aqua",
                  paddingBottom: "9px",
                  paddingLeft: "30px",
                  paddingRight: "30px"
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
                  borderBottom: "5px solid aqua",
                  paddingBottom: "9px",
                  paddingLeft: "30px",
                  paddingRight: "30px"
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
                  borderBottom: "5px solid aqua",
                  paddingBottom: "9px",
                  paddingLeft: "30px",
                  paddingRight: "30px"
                }}
                to="/manual-entry"
              >
                Manual Entry
              </NavLink>
            </Grid>
          </Grid>
          <Switch>
            <Route exact path="/">
              <ConcertList />
            </Route>
            <Route path="/concert-entry">
              <ConcertEntry />
            </Route>
            <Route path="/festival-entry">
              <FestivalEntry />
            </Route>
            <Route path="/manual-entry">
              <ManualEntry />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
