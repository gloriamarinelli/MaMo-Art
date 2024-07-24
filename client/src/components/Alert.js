import React from "react";
import "../style/alert.css";

export const Alerts = {
  AskConfirmation: 0,
  Confirm: 1,
};

function Alert(props) {
  function setTrue1() {
    props.result(true);
    sessionStorage.setItem("window", "library");
    window.location.replace(window.location.href);
  }

  function setTrue() {
    props.result(true);
  }

  function setFalse() {
    props.result(false);
  }

  return (
    <div className="Alert">
      <div className="MessageBubble">
        <h2>{props.body} ✔ </h2>
        <div className="Buttons">
          {props.type === Alerts.AskConfirmation && (
            <>
              <input
                type="button"
                id="cancel"
                value="Cancel"
                onClick={setFalse}
              ></input>
              <input
                type="button"
                id="confirm"
                value="Confirm"
                onClick={setTrue}
              ></input>
            </>
          )}
          {props.type === Alerts.Confirm && (
            <input
              type="button"
              id="confirm"
              value="Confirm"
              onClick={setTrue1}
            ></input>
          )}
        </div>
      </div>
    </div>
  );
}
export default Alert;
