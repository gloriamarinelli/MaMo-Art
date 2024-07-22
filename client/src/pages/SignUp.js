import "../style/login.css";

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Alert, { Alerts } from "../components/Alert";

const LoginResult = {
  correctField: 0,
  invalidField: 1,
  wrongContent: 2,
};

const endpoint = "http://localhost:5000/register";
const loggedIn = localStorage.getItem("LoggedUser");

function SignUp() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [invalidPs, SetInvPs] = useState(LoginResult.correctField);
  const [invalidUs, SetInvUs] = useState(LoginResult.correctField);
  const [invalidName, SetInvName] = useState(LoginResult.correctField);
  const [invalidSurn, SetInvSurn] = useState(LoginResult.correctField);
  const [invalidCopyPs, SetInvCopyPs] = useState(LoginResult.correctField);

  async function SubmitLogin() {
    var checkPassed = true;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var copyPassword = document.getElementById("copyPassword").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;

    if (!username) {
      SetInvUs(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!password || password.length < 8) {
      SetInvPs(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!copyPassword) {
      SetInvCopyPs(LoginResult.invalidField);
      checkPassed = false;
    }

    if (copyPassword !== password) {
      SetInvCopyPs(LoginResult.wrongContent);
      SetInvPs(LoginResult.wrongContent);
      checkPassed = false;
    }

    if (!name) {
      SetInvName(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!surname) {
      SetInvSurn(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!checkPassed) return;

    try {
      // Send a POST request to the /login endpoint of the Flask server
      const response = await axios.post(endpoint, {
        username,
        name,
        surname,
        password,
      });

      // If the login has been successfully performed, then redirect the user to the login page.
      if (response.status === 200) {
        setShowAlert(true);
      } else if (response.status === 400) {
        SetInvPs(LoginResult.invalidField);
      } else if (response.status === 500) {
        alert(response.message);
      }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  }

  function AlertConfirm(res) {
    setShowAlert(false);
    navigate("/login");
  }
  return (
    <div className="LoginContainer">
      {showAlert && (
        <Alert
          message="Success!"
          body="You have successfully created an account!"
          type={Alerts.Confirm}
          result={AlertConfirm}
        ></Alert>
      )}

      {loggedIn && <Navigate to="/homepage" />}
      <div className="Card">
        <div className="Title">
          <h1>Sign Up</h1>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>Username</h3>           
          </div>
          {((invalidUs === LoginResult.invalidField ||
            invalidUs === LoginResult.wrongContent) && (
            <input type="text" id="username" className="InvalidInput"></input>
          )) ||
            (invalidUs === LoginResult.correctField && (
              <input type="text" id="username"></input>
            ))}
          <div className="InputLabels">
            {invalidUs === LoginResult.invalidField && (
              <h4 className="invalidContentMessage">Invalid content!</h4>
            )}
            {invalidUs === LoginResult.wrongContent && (
              <h4 className="invalidContentMessage">Wrong username!</h4>
            )}
          </div>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>Name</h3>
          </div>
          {((invalidName === LoginResult.invalidField ||
            invalidName === LoginResult.wrongContent) && (
            <input type="text" id="name" className="InvalidInput"></input>
          )) ||
            (invalidName === LoginResult.correctField && (
              <input type="text" id="name"></input>
            ))}
          <div className="InputLabels">
            {invalidName === LoginResult.invalidField && (
              <h4 className="invalidContentMessage">Invalid content!</h4>
            )}
          </div>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>Surname</h3>
          </div>
          {((invalidSurn === LoginResult.invalidField ||
            invalidSurn === LoginResult.wrongContent) && (
            <input
              type="password"
              id="surname"
              className="InvalidInput"
            ></input>
          )) ||
            (invalidSurn === LoginResult.correctField && (
              <input type="text" id="surname"></input>
            ))}
          <div className="InputLabels">
            {invalidSurn === LoginResult.invalidField && (
              <h4 className="invalidContentMessage">Invalid content!</h4>
            )}
          </div>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>Password</h3>
          </div>
          {((invalidPs === LoginResult.invalidField ||
            invalidPs === LoginResult.wrongContent) && (
            <input
              type="password"
              id="password"
              className="InvalidInput"
            ></input>
          )) ||
            (invalidPs === LoginResult.correctField && (
              <input type="password" id="password"></input>
            ))}
          <div className="InputLabels">
            {invalidPs === LoginResult.invalidField && (
              <h4 className="invalidContentMessage">
                Insert at least 8 characters!
              </h4>
            )}
            {invalidPs === LoginResult.wrongContent && (
              <h4 className="invalidContentMessage">
                Passwords are different!
              </h4>
            )}
          </div>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>Confirm password</h3>
          </div>
          {((invalidCopyPs === LoginResult.invalidField ||
            invalidCopyPs === LoginResult.wrongContent) && (
            <input
              type="password"
              id="copyPassword"
              className="InvalidInput"
            ></input>
          )) ||
            (invalidCopyPs === LoginResult.correctField && (
              <input type="password" id="copyPassword"></input>
            ))}
          <div className="InputLabels">
            {invalidCopyPs === LoginResult.invalidField && (
              <h4 className="invalidContentMessage">Invalid content!</h4>
            )}
            {invalidCopyPs === LoginResult.wrongContent && (
              <h4 className="invalidContentMessage">
                Passwords are different!
              </h4>
            )}
          </div>
        </div>
        <input type="button" value="Register" onClick={SubmitLogin}></input>
        <h4>
        Do you already have an account?{" "}
              <span id="signUp" onClick={() => navigate("/login")}>
                Sign in
              </span>
            </h4>
      </div>
    </div>
  );
}

export default SignUp;
