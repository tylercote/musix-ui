import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import LocationSearchInput from "./LocationSearchInput";
import Rating from "react-rating";
import "./ConcertEntry.css";
import axiosClient from "../../utils/AxiosClient";
import { Redirect } from "react-router-dom";

class ConcertEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toGrid: false,
      artist: "",
      date: new Date(),
      rating: 0,
      comments: "",
      venueName: "",
      venueLocation: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleVenueSelect = this.handleVenueSelect.bind(this);
  }

  handleInputChange(event, field) {
    if (field === "date") {
      this.setState({ date: event });
    } else if (field === "comments") {
      this.setState({ comments: event.target.value });
    } else {
      this.setState({ artist: event.target.value });
    }
  }

  changeRating(newRating) {
    this.setState({
      rating: newRating
    });
  }

  postConcert() {
    let newConcert = {
      user: localStorage.getItem("userId"),
      artist: this.state.artist,
      rating: this.state.rating === 0 ? null : this.state.rating,
      comments: this.state.comments === "" ? null : this.state.comments,
      date: new Date(
        this.state.date.getTime() - this.state.date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0],
      venueName: this.state.venueName,
      venueLocation: this.state.venueLocation
    };

    axiosClient
      .post(`/api/v1/concerts/add_concert/`, newConcert)
      .then((response) => {
        this.clearSelections();
        this.setState(() => ({ toGrid: true }));
        setTimeout(this.props.openSnackbar("success", "Concert added."), 700);
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          this.props.handleLogout();
          this.props.openSnackbar(
              "error",
              `Session ended due to inactivity. Please log in again.`
          );
        }
        else {
          this.props.openSnackbar("error", "Concert not added: " + e);
        }
      });
  }

  clearSelections() {
    this.setState({
      artist: "",
      date: new Date(),
      comments: "",
      venueName: "",
      venueLocation: ""
    });
    this.changeRating(0);
  }

  handleVenueSelect(venueName, venueLocation) {
    this.setState({ venueName: venueName, venueLocation: venueLocation });
  }

  render() {
    if (this.state.toGrid === true) {
      return <Redirect exact to="/" />;
    }

    return (
      <Grid
        container
        className={"container"}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item className={"formContainer"} xs={10} sm={6}>
          <Paper className={"paperContainer"}>
            <h2>I went to see</h2>
            <TextField
              className={"inputWrapper"}
              InputProps={{
                className: "input"
              }}
              label={"Artist"}
              margin="normal"
              value={this.state.artist}
              onChange={(e) => this.handleInputChange(e, "artist")}
            />
            <h2>at</h2>
            <LocationSearchInput handleSelect={this.handleVenueSelect} />
            <h2>on</h2>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                className={"datePicker"}
                InputProps={{
                  className: "input"
                }}
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label={"Date"}
                value={this.state.date}
                onChange={(e) => this.handleInputChange(e, "date")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                  color: "secondary"
                }}
              />
            </MuiPickersUtilsProvider>
            <hr />
            <Rating
              className={"ratingWrapper"}
              fractions={100}
              initialRating={this.state.rating}
              onClick={this.changeRating.bind(this)}
              fullSymbol={"fa fa-star rating rating-full"}
              emptySymbol={"fa fa-star-o rating rating-empty"}
            />
            <TextField
              id="outlined-multiline-static"
              label="Comments"
              multiline
              rows="6"
              value={this.state.comments}
              onChange={(e) => this.handleInputChange(e, "comments")}
              className={"commentsSection inputWrapper"}
              InputProps={{
                className: "input",
                classes: {
                  notchedOutline: "inputLabel"
                }
              }}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              className={"addConcertButton"}
              onClick={this.postConcert.bind(this)}
            >
              Add
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default ConcertEntry;
