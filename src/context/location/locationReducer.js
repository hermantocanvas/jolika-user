import { LOCATION_CHANGE_ID } from "../types";

export default (state, action) => {
  if (action.type === LOCATION_CHANGE_ID) {
    localStorage.setItem("locationId", action.payload.id);

    return {
      ...state,
      locationId: action.payload.id,
    };
  }

  return state;
};
