import React, { useReducer } from "react";
//as we have array of alerts which will be looped, we need to use random id, so can use uuid
import uuid from "uuid";
import AlertContext from "./alertContext";
import AlertReducer from "./alertReducer";
import { SET_ALERT, REMOVE_ALERT } from "../types";

const AlertState = (props) => {
  //create array of alerts
  const initialState = [];

  //pullout the states and dispatch to alertReducer, by using useReducer hooks.
  //state allow us to access anything in state, dispatch allow us to disptach object to the reducer
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  //Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuid.v4(); //this will generate random id
    //dispatch to reducer
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id },
    });

    //make alert dissaper after 3 second (after 3 sec, run below script)
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      });
    }, timeout);
  };

  //return a provider, so we can wrap our application with this context
  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
