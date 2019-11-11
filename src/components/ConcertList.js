import React from "react";
import Grid from "@material-ui/core/Grid";

class ConcertList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <h2>Concert List</h2>
      </Grid>
    );
  }
}

export default ConcertList;
