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

  const [invalidUsername, setInvalidUsername] = useState(
    LoginResult.correctField
  );
  const [invalidPassword, setInvalidPassword] = useState(
    LoginResult.correctField
  );
  const [showAlert, setShowAlert] = useState(false);
  const [invalidName, setInvalidName] = useState(LoginResult.correctField);
  const [invalidCofirmPass, setInvalidCofirmPass] = useState(
    LoginResult.correctField
  );

  async function SubmitLogin() {
    var checkPassed = true;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var name = document.getElementById("name").value;

    if (!username) {
      setInvalidUsername(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!password || password.length < 8) {
      setInvalidPassword(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!confirmPassword) {
      setInvalidCofirmPass(LoginResult.invalidField);
      checkPassed = false;
    }

    if (confirmPassword !== password) {
      setInvalidCofirmPass(LoginResult.wrongContent);
      setInvalidPassword(LoginResult.wrongContent);
      checkPassed = false;
    }

    if (!name) {
      setInvalidName(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!checkPassed) return;

    try {
      const response = await axios.post(endpoint, {
        username,
        name,
        password,
      });

      if (response.status === 200) {
        setShowAlert(true);
      } else if (response.status === 400) {
        setInvalidPassword(LoginResult.invalidField);
      } else if (response.status === 500) {
        alert(response.message);
      }
    } catch (error) {
      console.log("[ERROR] Request failed: " + error);
    }
  }

  function AlertConfirm(res) {
    setShowAlert(false);
    navigate("/login");
  }

  return (
    <div
      className="SignUpContainer"
      style={{ backgroundImage: `url(${image1})` }}
    >
      {showAlert && (
        <Alert
          message=""
          body="Your account has been created successfully"
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
            {((invalidUsername === LoginResult.invalidField ||
              invalidUsername === LoginResult.wrongContent) && (
              <input type="text" id="username" className="InvalidInput" />
            )) || <input type="text" id="username" />}
            <div className="InputLabels">
              {invalidUsername === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
              {invalidUsername === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">Wrong username!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Name</h5>
            </div>
            {((invalidName === LoginResult.invalidField ||
              invalidName === LoginResult.wrongContent) && (
              <input type="text" id="name" className="InvalidInput" />
            )) || <input type="text" id="name" />}
            <div className="InputLabels">
              {invalidName === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
            </div>
          </div>

          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Password</h5>
            </div>
            {((invalidPassword === LoginResult.invalidField ||
              invalidPassword === LoginResult.wrongContent) && (
              <input type="password" id="password" className="InvalidInput" />
            )) || <input type="password" id="password" />}
            <div className="InputLabels">
              {invalidPassword === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">
                  Insert at least 8 characters!
                </h5>
              )}
              {invalidPassword === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">
                  Passwords are different!
                </h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Confirm Password</h5>
            </div>
            {((invalidCofirmPass === LoginResult.invalidField ||
              invalidCofirmPass === LoginResult.wrongContent) && (
              <input
                type="password"
                id="copyPassword"
                className="InvalidInput"
              />
            )) || <input type="password" id="copyPassword" />}
            <div className="InputLabels">
              {invalidCofirmPass === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
              {invalidCofirmPass === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">
                  Passwords are different!
                </h5>
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
