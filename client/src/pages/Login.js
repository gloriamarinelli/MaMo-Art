import "../style/login.css";

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
const LoginResult = {
  correctField: 0,
  invalidField: 1,
  wrongContent: 2,
};

const endpoint = "http://localhost:5000/login";
const loggedIn = localStorage.getItem("LoggedUser");

function Login() {
  const navigate = useNavigate();

  const [invalidPs, SetInvPs] = useState(LoginResult.correctField);
  const [invalidUs, SetInvUs] = useState(LoginResult.correctField);

  async function SubmitLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!username) {
      SetInvUs(LoginResult.invalidField);
      return;
    }

    if (!password) {
      SetInvPs(LoginResult.invalidField);
      return;
    }

    try {
      // Send a POST request to the /login endpoint of the Flask server
      const response = await axios.post(endpoint, {
        username,
        password,
      });

      // If the login has been successfully performed, then redirect the user to the homepage.
      if (response.data.status === 200) {
        localStorage.setItem("LoggedUser", username); // Set a session variable
        navigate("/homepage");
        window.location.replace(window.location.href);
      } else if (response.data.status === 400 || response.data.status === 404) {
        SetInvPs(LoginResult.wrongContent);
      }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  }

  return (
    <div className="LoginContainer">
      {loggedIn && <Navigate to="/homepage" />}
      <h1 className="Logo">EBook-Shelf</h1>
      <div className="Background"></div>
      <div className="Card">
        <div className="Title">
          <h1>Log in</h1>
        </div>
        <div className="InputForms">
          <div className="InputLabels">
            <h3>username</h3>
            <h4>
              Need an account?{" "}
              <span id="signUp" onClick={() => navigate("/signUp")}>
                {" "}
                Sign Up
              </span>
            </h4>
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
            <h3>password</h3>
            
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
              <h4 className="invalidContentMessage">Invalid content!</h4>
            )}
            {invalidPs === LoginResult.wrongContent && (
              <h4 className="invalidContentMessage">Wrong password!</h4>
            )}
          </div>
        </div>
        <input type="button" value="Login" onClick={SubmitLogin}></input>
      </div>
    </div>
  );
}

export default Login;
