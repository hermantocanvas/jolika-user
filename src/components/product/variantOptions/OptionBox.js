import React from "react";

const OptionBox = ({ option, setVariant, selected }) => {
  const styles = {
    box: {
      display: "inline-block",
      cursor: "pointer",
      border: "1px #4b89dc solid",
      padding: "2px 10px",
      margin: "5px 0px",
      marginRight: "10px",
      color: "#4b89dc",
      borderRadius: "10px",
      fontSize: "14px",
    },
    activeBox: {
      display: "inline-block",
      cursor: "pointer",
      border: "1px #4b89dc solid",
      padding: "2px 10px",
      margin: "5px 0px",
      marginRight: "10px",
      backgroundColor: "#4b89dc",
      color: "#fff",
      borderRadius: "10px",
      fontSize: "14px",
    },
  };
  return (
    <div
      style={selected ? styles.activeBox : styles.box}
      key={option._id}
      onClick={(e) => setVariant(option)}
    >
      {option.nameEn}
    </div>
  );
};

export default OptionBox;
