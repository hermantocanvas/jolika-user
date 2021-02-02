import React, { useReducer } from "react";
import LocationContext from "./locationContext";
import LocationReducer from "./locationReducer";
import { LOCATION_CHANGE_ID } from "../types";

const LocationState = (props) => {
  const storage = localStorage.getItem("locationId");
  const locationId = storage ? storage : "5fcb78d9fdd3f7365c1f54c7";

  const initialState = {
    locationId: locationId,
  };

  const [state, dispatch] = useReducer(LocationReducer, initialState);

  const changeLocation = (id) => {
    return dispatch({
      type: LOCATION_CHANGE_ID,
      payload: {
        id,
      },
    });
  };

  const value = {
    locationId: state.locationId,
    changeLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {props.children}
    </LocationContext.Provider>
  );
};

export default LocationState;
