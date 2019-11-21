import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import TextField from "@material-ui/core/TextField";
import "./LocationSearchInput.css";

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  onSelect = (address, placeId) => {
    console.log(address);
  };

  handleChange = address => {
    this.setState({ address });
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={"wrapper"}>
            <TextField
              {...getInputProps({
                className: "location-search-input"
              })}
              label={"Venue..."}
              InputProps={{
                className: "input"
              }}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "lightgrey", cursor: "pointer" }
                  : { backgroundColor: "aliceblue", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                    onClick={() => {
                      this.handleChange(suggestion.description);
                      this.props.handleSelect(
                        suggestion.formattedSuggestion.mainText,
                        suggestion.formattedSuggestion.secondaryText
                      );
                    }}
                  >
                    <span className={"suggestion"}>
                      {suggestion.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
export default LocationSearchInput;
