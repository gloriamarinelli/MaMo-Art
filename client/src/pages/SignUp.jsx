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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  const [invalidUsername, setInvalidUsername] = useState(LoginResult.correctField);
  const [invalidPassword, setInvalidPassword] = useState(LoginResult.correctField);
  const [showAlert, setShowAlert] = useState(false);
  const [invalidName, setInvalidName] = useState(LoginResult.correctField);
  const [invalidConfirmPass, setInvalidConfirmPass] = useState(LoginResult.correctField);

  async function SubmitLogin() {
    var checkPassed = true;

    if (!username) {
      setInvalidUsername(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!password || password.length < 8) {
      setInvalidPassword(LoginResult.invalidField);
      checkPassed = false;
    }

    if (!confirmPassword) {
      setInvalidConfirmPass(LoginResult.invalidField);
      checkPassed = false;
    }

    if (confirmPassword !== password) {
      setInvalidConfirmPass(LoginResult.wrongContent);
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
    <div className="SignUpContainer" style={{ backgroundImage: `url(${image1})` }}>
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
            <input
              type="text"
              id="username"
              className={invalidUsername ? "InvalidInput" : ""}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <input
              type="text"
              id="name"
              className={invalidName ? "InvalidInput" : ""}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <input
              type="password"
              id="password"
              className={invalidPassword ? "InvalidInput" : ""}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="InputLabels">
              {invalidPassword === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Insert at least 8 characters!</h5>
              )}
              {invalidPassword === LoginResult.wrongContent && (
                <h5 className="invalidContentMessage">Passwords are different!</h5>
              )}
            </div>
          </div>
          <div className="InputForms">
            <div className="InputLabels">
              <h5 style={{ textAlign: "left" }}>Confirm Password</h5>
            </div>
            <input
              type="password"
              id="confirmPassword"
              className={invalidConfirmPass ? "InvalidInput" : ""}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="InputLabels">
              {invalidConfirmPass === LoginResult.invalidField && (
                <h5 className="invalidContentMessage">Invalid content!</h5>
              )}
              {invalidConfirmPass === LoginResult.wrongContent && (
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
