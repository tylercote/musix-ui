import React from "react";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link } from "react-router-dom";
import ManualCrud from "./ManualCrud";
import axiosClient from "../../utils/AxiosClient";

class ManualEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      data: {
        artists: [],
        genres: [],
        venues: [],
        concerts: [],
        festivals: [],
        reviews: []
      }
    };
    this.fetchRows = this.fetchRows.bind(this);
  }

  componentDidMount() {
    this.fetchRows("artists");
    this.fetchRows("genres");
    this.fetchRows("venues");
    this.fetchRows("concerts");
    this.fetchRows("festivals");
    this.fetchRows("reviews");
  }

  fetchRows(endpoint) {
    axiosClient
      .get(`/api/v1/${endpoint}/`)
      .then((response) => {
        this.setState((prevState) => {
          let oldData = Object.assign({}, prevState.data);
          oldData[endpoint] = response.data;
          return { data: oldData };
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ ...this.state });
      });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  // Recieve array of {name, field, type}
  buildColumnModelAndDefinitions(columns) {
    let columnModel = {};
    let columnDefs = [];
    for (let col of columns) {
      if (col.type === "date") {
        columnModel[col.field] = new Date();
      } else {
        columnModel[col.field] = "";
      }
      let columnDef = {
        headerName: col.name,
        field: col.field,
        suppressMenu: true,
        type: col.type
      };
      columnDefs.push(columnDef);
    }
    return {
      columnModel: columnModel,
      columnDefs: columnDefs
    };
  }

  render() {
    return (
      <div className={"tabContainer"}>
        <AppBar
          position="static"
          className="tabBar"
          style={{ backgroundColor: "grey" }}
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            // textColor="primary"
          >
            <Tab label="Artist" component={Link} to="/manual-entry/artist" />
            <Tab label="Genre" component={Link} to="/manual-entry/genre" />
            <Tab label="Venue" component={Link} to="/manual-entry/venue" />
            <Tab label="Concert" component={Link} to="/manual-entry/concert" />
            <Tab
              label="Festival"
              component={Link}
              to="/manual-entry/festival"
            />
            <Tab label="Review" component={Link} to="/manual-entry/review" />
          </Tabs>
        </AppBar>

        <Switch>
          <Route
            path="/manual-entry/artist"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Name", field: "name", type: "text" }
              ]);
              return (
                <ManualCrud
                  endpoint={"artists"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.artists}
                  fetchRows={() => this.fetchRows("artists")}
                />
              );
            }}
          />
          <Route
            path="/manual-entry/genre"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Name", field: "name", type: "text" }
              ]);
              return (
                <ManualCrud
                  endpoint={"genres"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.genres}
                  fetchRows={() => this.fetchRows("genres")}
                />
              );
            }}
          />
          <Route
            path="/manual-entry/venue"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Name", field: "name", type: "text" },
                { name: "Location", field: "location", type: "text" }
              ]);
              return (
                <ManualCrud
                  endpoint={"venues"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.venues}
                  fetchRows={() => this.fetchRows("venues")}
                />
              );
            }}
          />
          <Route
            path="/manual-entry/concert"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Artist ID", field: "artist", type: "int" },
                { name: "Venue ID", field: "venue", type: "int" },
                { name: "Festival ID", field: "festival", type: "int" },
                { name: "Date", field: "date", type: "date" }
              ]);
              return (
                <ManualCrud
                  endpoint={"concerts"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.concerts}
                  fetchRows={() => this.fetchRows("concerts")}
                />
              );
            }}
          />
          <Route
            path="/manual-entry/festival"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Venue ID", field: "venue", type: "int" },
                { name: "Name", field: "name", type: "text" },
                { name: "Start Date", field: "startDate", type: "date" },
                { name: "End Date", field: "endDate", type: "date" }
              ]);
              return (
                <ManualCrud
                  endpoint={"festivals"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.festivals}
                  fetchRows={() => this.fetchRows("festivals")}
                />
              );
            }}
          />
          <Route
            path="/manual-entry/review"
            render={() => {
              let colObj = this.buildColumnModelAndDefinitions([
                { name: "ID", field: "id", type: "int" },
                { name: "Concert ID", field: "concert", type: "int" },
                { name: "Stars", field: "stars", type: "float" },
                { name: "Comments", field: "comments", type: "text" }
              ]);
              return (
                <ManualCrud
                  endpoint={"reviews"}
                  columnModel={colObj.columnModel}
                  columnDefs={colObj.columnDefs}
                  data={this.state.data.reviews}
                  fetchRows={() => this.fetchRows("reviews")}
                />
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default ManualEntry;
