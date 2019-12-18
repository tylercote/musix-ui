import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import Autocomplete from "react-autocomplete";
import { Autocomplete as MaterialAutocomplete } from "@material-ui/lab";
import Rating from "react-rating";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./FestivalEntry.css";
import axiosClient from "../../utils/AxiosClient";
import { Redirect } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class FestivalEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toGrid: false,
      festivals: [],
      festivalSelectionValue: "",
      festivalSelectionItem: "",
      artists: [],
      artistSelections: [],
      artistReviews: {}
    };
    this.fetchNewArtists = this.fetchNewArtists.bind(this);
    this.postConcerts = this.postConcerts.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
  }

  componentDidMount() {
    axiosClient
      .get(`/api/v1/festivals/`)
      .then((response) => {
        this.setState({
          festivals: response.data.sort((a, b) => a.name.localeCompare(b.name))
        });
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          this.props.handleLogout();
          this.props.openSnackbar(
              "error",
              `Session ended due to inactivity. Please log in again.`
          );
        } else {
          this.props.openSnackbar("error", `Could not fetch festivals: ${e}.`);
        }
      });
  }

  fetchNewArtists(festivalId) {
    axiosClient
      .get(`/api/v1/festivals/${festivalId}/get_artists/`)
      .then((response) => {
        this.setState({
          artists: response.data.sort((a, b) => a.name.localeCompare(b.name))
        });
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
          this.props.openSnackbar("error", `Could not fetch artists: ${e}.`);
        }
      });
  }

  changeRating(value, artistId) {
    let newReviews = Object.assign({}, this.state.artistReviews);
    newReviews[artistId].rating = value;
    this.setState({ artistReviews: newReviews });
  }

  handleCommentsChange(event, artistId) {
    let newReviews = Object.assign({}, this.state.artistReviews);
    newReviews[artistId].comments = event.target.value;
    this.setState({ artistReviews: newReviews });
  }

  postConcerts() {
    let postRequests = [];

    for (let artist of this.state.artistSelections) {
      let concert = {};
      concert.user = localStorage.getItem("userId");
      concert.artist = artist.id;
      concert.venue = this.state.festivalSelectionItem.venue;
      concert.festival = this.state.festivalSelectionItem.id;
      concert.date = this.state.festivalSelectionItem.startDate;
      let concertId = null;
      postRequests.push(
        axiosClient
          .post(`/api/v1/concerts/`, concert)
          .then((response) => {
            concertId = response.data.id;
            let review = {};
            review.user = localStorage.getItem("userId");
            review.concert = concertId;
            review.stars =
              this.state.artistReviews[artist.id].rating === 0
                ? null
                : this.state.artistReviews[artist.id].rating;
            review.comments = this.state.artistReviews[artist.id].comments;
            if (review.stars !== 0 || review.comments !== "") {
              axiosClient
                .post(`/api/v1/reviews/`, review)
                .then((response) => {})
                .catch((e) => {
                  if (e.response && e.response.status === 401) {
                    this.props.handleLogout();
                    this.props.openSnackbar(
                        "error",
                        `Session ended due to inactivity. Please log in again.`
                    );
                  }
                  else {
                    this.props.openSnackbar(
                        "error",
                        `Could not post reviews: ${e}.`
                    );
                  }

                });
            }
          })
          .catch((e) => {
            if (e.response && e.response.status === 401) {
              this.props.handleLogout();
              this.props.openSnackbar(
                  "error",
                  `Session ended due to inactivity. Please log in again.`
              );
            }
          })
      );
    }

    Promise.all(postRequests)
      .then((response) => {
        this.clearSelections();
        this.setState(() => ({ toGrid: true }));
        setTimeout(
          this.props.openSnackbar(
            "success",
            `Saved ${postRequests.length} concerts.`
          ),
          700
        );
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
          this.props.openSnackbar(
              "error",
              `Could not save ${postRequests.length} concerts: ${e}`
          );
        }
      });
  }

  clearSelections() {
    this.setState({
      festivalSelectionValue: "",
      festivalSelectionItem: "",
      artists: [],
      artistSelections: [],
      artistReviews: {}
    });
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
        <Grid item className={"formContainer"} xs={8}>
          <Paper className={"paperContainer"}>
            <h2>I went to</h2>
            <Autocomplete
              getItemValue={(item) =>
                item.name + " " + item.startDate.substr(0, 4)
              }
              items={this.state.festivals}
              menuStyle={{
                borderRadius: "0px",
                textAlign: "left",
                backgroundColor: "#626262 !important"
              }}
              renderItem={(item, isHighlighted) => (
                <div
                  key={item.id}
                  className={"festivalSuggestion"}
                  style={{
                    fontWeight: isHighlighted ? "bold" : "regular",
                    color: isHighlighted ? "aqua" : "#eeeeee"
                  }}
                >
                  {item.name + " " + item.startDate.substr(0, 4)}
                </div>
              )}
              value={this.state.festivalSelectionValue}
              onChange={(e) => {
                this.setState({ festivalSelectionValue: e.target.value });
              }}
              onSelect={(val, item) => {
                this.setState({
                  festivalSelectionValue: val,
                  festivalSelectionItem: item
                });
                this.fetchNewArtists(item.id);
              }}
              renderInput={(props) => (
                <TextField
                  {...props}
                  label={"Festival"}
                  InputProps={{
                    className: "input"
                  }}
                ></TextField>
              )}
            />
            <h2>and I saw</h2>
            <MaterialAutocomplete
              multiple
              id="checkboxes-tags-demo"
              options={this.state.artists}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </React.Fragment>
              )}
              style={{
                width: 500,
                marginLeft: "auto",
                marginRight: "auto",
                color: "#eeeeee !important"
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Artists"
                  fullWidth
                  style={{
                    color: "#eeeeee"
                  }}
                />
              )}
              value={this.state.artistSelections}
              onChange={(event, value) => {
                this.setState({
                  artistSelections: value,
                  artistReviews: value.reduce((map, obj) => {
                    map[obj.id] = { rating: 0, comments: "" };
                    return map;
                  }, {})
                });
              }}
            />
            {this.state.artistSelections.map((artist, index) => {
              return (
                <div key={artist.id + index} className={"reviewContainer"}>
                  <hr />
                  <h3>{artist.name}</h3>
                  <Rating
                    className={"ratingSpan"}
                    fractions={100}
                    initialRating={this.state.artistReviews[artist.id].rating}
                    onClick={(e) => this.changeRating(e, artist.id)}
                    fullSymbol={"fa fa-star rating rating-full"}
                    emptySymbol={"fa fa-star-o rating rating-empty"}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Comments"
                    multiline
                    rows="2"
                    value={this.state.artistReviews[artist.id].comments}
                    onChange={(e) => this.handleCommentsChange(e, artist.id)}
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
                </div>
              );
            })}
            <Button
              variant="contained"
              className={"addConcertButton"}
              onClick={this.postConcerts.bind(this)}
            >
              Add
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default FestivalEntry;
