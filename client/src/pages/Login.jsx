import "../style/login.css";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import image from "../images/MaMo.png";
import image1 from "../images/bg.png";

const LoginResult = {
  correctField: 0,
  invalidField: 1,
  wrongContent: 2,
};

const endpoint = "http://localhost:5000/login";
const loggedIn = localStorage.getItem("LoggedUser");

function Login() {
  const navigate = useNavigate();

  const [invalidPassword, setInvalidPassword] = useState(
    LoginResult.correctField
  );
  const [invalidUsername, setInvalidUsername] = useState(
    LoginResult.correctField
  );

  async function SubmitLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!username) {
      setInvalidUsername(LoginResult.invalidField);
      return;
    }

    if (!password) {
      setInvalidPassword(LoginResult.invalidField);
      return;
    }

    try {
      const response = await axios.post(endpoint, {
        username,
        password,
      });

      if (response.data.status === 200) {
        setLogoutTimeout();
        navigate("/homepage");
        window.location.replace(window.location.href);
      } else if (response.data.status === 400 || response.data.status === 404) {
        setInvalidPassword(LoginResult.wrongContent);
      }
    } catch (error) {
      console.log("Request failed: " + error);
    }
  }

  function logout() {
    navigate("/login");
    window.location.replace(window.location.href);
  }

  function setLogoutTimeout() {
    setTimeout(() => {
      logout();
    }, 180000);
  }

  useEffect(() => {
    if (loggedIn) {
      setLogoutTimeout();
    }
  }, [loggedIn]);

  return (
    <>
      <div
        className="LoginContainer"
        style={{ backgroundImage: `url(${image1})` }}
      >
        {loggedIn && <Navigate to="/homepage" />}
        <div className="Card">
          <div className="Logo">
            <img src={image} width="150" height="150" alt=""></img>
          </div>
          <div className="Title">
            <h1>Sign In</h1>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h4 style={{ textAlign: "left" }}>Username</h4>
            </div>
            {((invalidUsername === LoginResult.invalidField ||
              invalidUsername === LoginResult.wrongContent) && (
              <input type="text" id="username" className="InvalidInput"></input>
            )) ||
              (invalidUsername === LoginResult.correctField && (
                <input type="text" id="username"></input>
              ))}
            <div className="InputLabels">
              {invalidUsername === LoginResult.invalidField && (
                <h4 className="invalidContentMessage">Invalid content!</h4>
              )}
              {invalidUsername === LoginResult.wrongContent && (
                <h4 className="invalidContentMessage">Wrong username!</h4>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div style={{ marginTop: "10px" }}>
              <h4 style={{ textAlign: "left" }}>Password</h4>
            </div>
            {((invalidPassword === LoginResult.invalidField ||
              invalidPassword === LoginResult.wrongContent) && (
              <input
                type="password"
                id="password"
                className="InvalidInput"
              ></input>
            )) ||
              (invalidPassword === LoginResult.correctField && (
                <input type="password" id="password"></input>
              ))}
            <div className="InputLabels">
              {invalidPassword === LoginResult.invalidField && (
                <h4 className="invalidContentMessage">Invalid content!</h4>
              )}
              {invalidPassword === LoginResult.wrongContent && (
                <h4 className="invalidContentMessage">Wrong password!</h4>
              )}
            </div>
          </div>
          <input
            style={{ marginTop: "20px" }}
            type="button"
            value="Login"
            onClick={SubmitLogin}
          ></input>
          <h6 style={{ marginTop: "20px" }}>
            New to MaMo Art?
            <span id="signUp" onClick={() => navigate("/signUp")}>
              Create your account
            </span>
          </h6>
        </div>
      </div>
    </>
  );
}

export default Login;
