import React, { useContext } from "react";
import AlertContext from "../../context/alert/alertContext";

const Alerts = () => {
  //initialize alert context
  const alertContext = useContext(AlertContext);

  //scroll to top
  window.scrollTo(0, 0);

  //check to see if any alerts in the array
  return (
    alertContext.alerts.length > 0 &&
    alertContext.alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i className="fa fa-info-circle"></i> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
