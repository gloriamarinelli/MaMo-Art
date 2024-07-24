import "../style/login.css";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Alert, { Alerts } from "../components/Alert";
import image from "../images/MaMo.png";
import image1 from "../images/bg.png";

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
    <div className="LoginContainer" style={{ backgroundImage: `url(${image1})` }}>
      {showAlert && (
        <Alert
          message=""
          body="Your account has been created successfully."
          type={Alerts.Confirm}
          result={AlertConfirm}
        />
      )}
      
      {loggedIn && <Navigate to="/homepage" />}

      {!showAlert && (
        <div className="Card">
          <div className="Logo">
            <img src={image} width="150" height="150" alt="" />
          </div>

          <div className="Title">
            <h1>Sign Up</h1>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Username</h5>
            </div>
            {((invalidUs === LoginResult.invalidField || invalidUs === LoginResult.wrongContent) && (
              <input type="text" id="username" className="InvalidInput" />
            )) || (
              <input type="text" id="username" />
            )}
            <div className="InputLabels">
              {invalidUs === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
              {invalidUs === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">Wrong username!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Name</h5>
            </div>
            {((invalidName === LoginResult.invalidField || invalidName === LoginResult.wrongContent) && (
              <input type="text" id="name" className="InvalidInput" />
            )) || (
              <input type="text" id="name" />
            )}
            <div className="InputLabels">
              {invalidName === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Surname</h5>
            </div>
            {((invalidSurn === LoginResult.invalidField || invalidSurn === LoginResult.wrongContent) && (
              <input type="text" id="surname" className="InvalidInput" />
            )) || (
              <input type="text" id="surname" />
            )}
            <div className="InputLabels">
              {invalidSurn === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Password</h5>
            </div>
            {((invalidPs === LoginResult.invalidField || invalidPs === LoginResult.wrongContent) && (
              <input type="password" id="password" className="InvalidInput" />
            )) || (
              <input type="password" id="password" />
            )}
            <div className="InputLabels">
              {invalidPs === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Insert at least 8 characters!</h5>
              )}
              {invalidPs === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">Passwords are different!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Confirm Password</h5>
            </div>
            {((invalidCopyPs === LoginResult.invalidField || invalidCopyPs === LoginResult.wrongContent) && (
              <input type="password" id="copyPassword" className="InvalidInput" />
            )) || (
              <input type="password" id="copyPassword" />
            )}
            <div className="InputLabels">
              {invalidCopyPs === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
              {invalidCopyPs === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">Passwords are different!</h5>
              )}
            </div>
          </div>
          <input
            style={{ marginTop: "20px" }}
            type="button"
            value="Register"
            onClick={SubmitLogin}
          />
          <h6 style={{ marginTop: "20px" }}>
            Do you already have an account?
            <span id="signUp" onClick={() => navigate("/login")}>
              Sign in
            </span>
          </h6>
        </div>
      )}
    </div>
  );
}

export default SignUp;
