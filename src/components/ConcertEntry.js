import React from "react";
import Grid from "@material-ui/core/Grid";

class ConcertEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <h2>Concert Entry</h2>
      </Grid>
    );
  }
}

export default ConcertEntry;
