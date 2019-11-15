import React from "react";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-dark.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import axios from "axios";
import "./ManualCrud.css";

class ManualCrud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      columnModel: this.props.columnModel,
      gridOptions: {
        floatingFilter: true,
        defaultColDef: {
          sortable: true,
          filterable: true,
          editable: true,
          suppressMenu: true
        },
        columnTypes: {
          text: {
            filter: "agTextColumnFilter"
          },
          int: {
            type: "numericColumn",
            filter: "agNumberColumnFilter"
          },
          float: {
            type: "numericColumn",
            filter: "agNumberColumnFilter"
          },
          date: {
            filter: "agDateColumnFilter"
          }
        }
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event, field) {
    if (event instanceof Date) {
      this.setState(prevState => {
        let oldCol = Object.assign({}, prevState.columnModel);
        oldCol[field] = event;
        return { columnModel: oldCol };
      });
    } else {
      event.persist();
      this.setState(prevState => {
        let oldCol = Object.assign({}, prevState.columnModel);
        oldCol[field] = event.target.value;
        return { columnModel: oldCol };
      });
    }
  }

  postRow() {
    let rowToPost = Object.assign({}, this.state.columnModel);
    for (let col of this.props.columnDefs) {
      if (col.type === "int") {
        if (rowToPost[col.field] === "") {
          rowToPost[col.field] = null;
        } else {
          rowToPost[col.field] = parseInt(rowToPost[col.field]);
        }
      } else if (col.type === "float") {
        if (rowToPost[col.field] === "") {
          rowToPost[col.field] = null;
        } else {
          rowToPost[col.field] = parseFloat(rowToPost[col.field]);
        }
      } else if (col.type === "date") {
        rowToPost[col.field] = new Date(
          rowToPost[col.field].getTime() -
            rowToPost[col.field].getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
      }
    }
    console.log("Posting: ", rowToPost);
    axios
      .post(`http://localhost:8000/api/v1/${this.props.endpoint}/`, rowToPost)
      .then(response => {
        this.props.fetchRows();
      })
      .catch(e => {
        console.log(e);
      });
  }

  putRow(event) {
    let oldValue = event.oldValue;
    axios
      .put(
        `http://localhost:8000/api/v1/${this.props.endpoint}/${event.data.id}/`,
        event.data
      )
      .then(response => {
        this.props.fetchRows();
      })
      .catch(e => {
        event.node.setDataValue(event.colDef.field, oldValue);
        this.props.fetchRows();
      });
  }

  rowSelected() {
    let selectedRow = this.state.gridOptions.api.getSelectedRows()[0];
    this.setState({ selectedRow: selectedRow });
  }

  deleteSelectedRow() {
    axios
      .delete(
        `http://localhost:8000/api/v1/${this.props.endpoint}/${this.state.selectedRow.id}/`
      )
      .then(response => {
        this.props.fetchRows();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className={"wrapper"}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            {this.props.columnDefs.map((col, index) => {
              // console.log(col);
              if (col.type === "date") {
                return (
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    key={col.field + index}
                  >
                    <KeyboardDatePicker
                      key={col.field + index}
                      disableToolbar
                      className={"datePicker"}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label={col.name}
                      value={this.state.columnModel[col.field]}
                      onChange={e => this.handleInputChange(e, col.field)}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </MuiPickersUtilsProvider>
                );
              } else {
                return (
                  <TextField
                    key={col.field + index}
                    className={"inputField"}
                    label={col.headerName}
                    margin="normal"
                    value={
                      this.state.columnModel[col.field]
                        ? this.state.columnModel[col.field]
                        : ""
                    }
                    onChange={e => this.handleInputChange(e, col.field)}
                    type={col.type === "text" ? "text" : "number"}
                  />
                );
              }
            })}
            <Button
              variant="contained"
              className={"addButton"}
              onClick={this.postRow.bind(this)}
            >
              Add
            </Button>
            <Button
              variant="contained"
              className={"deleteButton"}
              onClick={this.deleteSelectedRow.bind(this)}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={12}>
            <div
              className="ag-theme-dark"
              style={{
                height: "700px",
                width: "100%"
              }}
            >
              <AgGridReact
                columnDefs={this.props.columnDefs}
                rowData={this.props.data}
                gridOptions={this.state.gridOptions}
                onCellValueChanged={this.putRow.bind(this)}
                rowSelection={"single"}
                onSelectionChanged={this.rowSelected.bind(this)}
              ></AgGridReact>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ManualCrud;
