import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { AgGridReact } from "ag-grid-react";
import axiosClient from "../../utils/AxiosClient";
import "./ConcertGrid.css";
import { Paper } from "@material-ui/core";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';


class ConcertGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      rows: [],
      columnDefs: [
        {
          headerName: "Artist",
          field: "artistname",
          suppressMenu: true,
          type: "text"
        },
        {
          headerName: "Date",
          field: "date",
          suppressMenu: true,
          type: "date",
          sort: "desc",
          width: 160
        },
        {
          headerName: "Venue",
          field: "venuename",
          suppressMenu: true,
          type: "text"
        },
        {
          headerName: "Location",
          field: "venuelocation",
          suppressMenu: true,
          type: "text"
        },
        {
          headerName: "Festival",
          field: "festivalname",
          suppressMenu: true,
          type: "text",
          editable: false,
        },
        {
          headerName: "Rating",
          field: "stars",
          suppressMenu: true,
          type: "float",
          width: 80
        },
        {
          headerName: "Comments",
          field: "comments",
          suppressMenu: true,
          type: "text",
          width: 340
        }
      ],
      gridOptions: {
        floatingFilter: true,
        defaultColDef: {
          sortable: true,
          filterable: true,
          editable: true,
          suppressMenu: true,
          resizable: true,
          enableCellChangeFlash: true,
          // valueSetter: this.putRow.bind(this)
        },
        columnTypes: {
          text: {
            filter: "agTextColumnFilter",
            cellStyle: {
              textAlign: "left"
            }
          },
          int: {
            type: "numericColumn",
            filter: "agNumberColumnFilter",
            cellStyle: {
              textAlign: "right"
            }
          },
          float: {
            type: "numericColumn",
            filter: "agNumberColumnFilter",
            cellStyle: {
              textAlign: "right"
            }
          },
          date: {
            filter: "agDateColumnFilter",
            cellStyle: {
              textAlign: "left"
            }
          }
        }
      }
    };
    this.fetchRows = this.fetchRows.bind(this);
    this.deleteSelectedConcerts = this.deleteSelectedConcerts.bind(this);
  }

  componentDidMount() {
    this.fetchRows();
  }


  rowSelected() {
    let selectedRows = this.state.gridOptions.api.getSelectedRows();
    this.setState({ selectedRows: selectedRows });
  }

  deleteSelectedConcerts() {
    let concertsToDelete = this.state.gridOptions.api.getSelectedRows();
    concertsToDelete.forEach((concert) => {
      axiosClient
        .delete(`/api/v1/concerts/${concert.id}/`)
        .then((response) => {
          this.fetchRows();
          this.props.openSnackbar(
            "success",
            `Deleted ${concertsToDelete.length} concerts.`
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
                `Could not delete ${concertsToDelete.length} concerts.`
            );
          }
        });
    });
    this.setState({ selectedRows: [] });
  }

  fetchRows() {
    axiosClient
      .get(`/api/v1/concerts/get_concerts/`)
      .then((response) => {
        this.setState({ rows: response.data });
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
          this.props.openSnackbar("error", `Could not fetch concerts: ${e}.`);
        }
      });
  }

  putRow(event) {
    if (event.colDef.field === "artistname") {
      this.updateArtist(event);
    } else if (event.colDef.field === "date") {
      this.updateConcert(event);
    } else if (
      event.colDef.field === "venuename" ||
      event.colDef.field === "venuelocation"
    ) {
      this.updateVenue(event);
    } else if (
      event.colDef.field === "stars" ||
      event.colDef.field === "comments"
    ) {
      this.updateReview(event);
    }
  }

  updateArtist(event) {
    // Make new artist, update with FK of new artist
    let artist = { name: event.newValue };
    axiosClient
      .post(`/api/v1/artists/`, artist)
      .then((response) => {
        axiosClient
          .patch(`/api/v1/concerts/${event.data.id}/`, {
            artist: response.data.id
          })
          .then((response) => {
            this.fetchRows();
          })
          .catch((e) => {
            if (e.response && e.response.status === 401) {
              this.props.handleLogout();
              this.props.openSnackbar(
                  "error",
                  `Session ended due to inactivity. Please log in again.`
              );
            }
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
          this.props.openSnackbar("error", `Could not update artist.`);
        }
      });
  }

  updateConcert(event) {
    axiosClient
      .patch(`/api/v1/concerts/${event.data.id}/`, {
        date: event.data.date
      })
      .then((response) => {
        this.fetchRows();
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
          this.props.openSnackbar("error", `Could not update concert: ${e}`);
        }
      });
  }

  updateVenue(event) {
    // Make new venue, update concert with FK of new artist
    let venue = {
      name: event.data.venueName,
      location: event.data.venueLocation
    };
    axiosClient
      .post(`/api/v1/venues/`, venue)
      .then((response) => {
        axiosClient
          .patch(`/api/v1/concerts/${event.data.id}/`, {
            venue: response.data.id
          })
          .then((response) => {
            this.fetchRows();
          })
          .catch((e) => {
            if (e.response && e.response.status === 401) {
              this.props.handleLogout();
              this.props.openSnackbar(
                  "error",
                  `Session ended due to inactivity. Please log in again.`
              );
            }
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
          this.props.openSnackbar("error", `Could not update venue.`);
        }
      });
  }

  updateReview(event) {
    let review = {
      concert: event.data.id,
      stars: event.data.stars,
      comments: event.data.comments
    };
    if (review.stars >= 0 && review.stars <= 5) {
      if (event.data.review_id) {
          axiosClient
              .patch(`/api/v1/reviews/${event.data.review_id}/`, review)
              .then((response) => {
                this.fetchRows();
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
                  this.props.openSnackbar("error", `Could not update review.`);
                }
              });
      } else {
        axiosClient
            .post(`/api/v1/reviews/`, review)
            .then((response) => {
              this.fetchRows();
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
                this.props.openSnackbar("error", `Could not update review.`);
              }
            });
      }
    }
  }

  render() {
    return (
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12}>
          <Paper className={"paperContainer"}>
            <div
              className="ag-theme-dark"
              style={{
                height: "515px",
                width: "100%"
              }}
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rows}
                gridOptions={this.state.gridOptions}
                onCellValueChanged={this.putRow.bind(this)}
                rowSelection={"multiple"}
                rowDeselection={true}
                onSelectionChanged={this.rowSelected.bind(this)}
              />
              <Button
                variant="contained"
                className={"deleteButton"}
                onClick={this.deleteSelectedConcerts}
                disabled={this.state.selectedRows.length === 0}
              >
                Delete Selected
              </Button>
              <Button
                variant="contained"
                className={"clearButton"}
                onClick={() => {
                  this.state.gridOptions.api.deselectAll();
                  this.setState({ selectedRows: [] });
                }}
                disabled={this.state.selectedRows.length === 0}
              >
                Clear Selections
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default ConcertGrid;
