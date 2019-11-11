import React from "react";
import "./App.css";
import "typeface-roboto";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ConcertList from "./components/ConcertList";
import FestivalEntry from "./components/FestivalEntry";
import ConcertEntry from "./components/ConcertEntry";
import ManualEntry from "./components/ManualEntry";
import Grid from "@material-ui/core/Grid";

function App() {
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
            <Link className="navButton" to="/">
              View my Concerts
            </Link>
          </Grid>
          <Grid item xs>
            <Link className="navButton" to="/concert-entry">
              Enter a Concert
            </Link>
          </Grid>
          <Grid item xs>
            <Link className="navButton" to="/festival-entry">
              Enter a Festival
            </Link>
          </Grid>
          <Grid item xs>
            <Link className="navButton" to="/manual-entry">
              Manual Entry
            </Link>
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

export default App;
