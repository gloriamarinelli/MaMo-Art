import React, { useState, useEffect } from "react";
import image from "../images/MaMo.png";
import "bootstrap/dist/css/bootstrap.css";

function Navbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("LoggedUser");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("LoggedUser");
    setUsername("");
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        style={{ backgroundColor: "rgba(255, 127, 80, 0.9)" }}
        className="navbar navbar-expand-lg"
      >
        <img src={image} width="100" height="100" marginLeft="200px" alt="" />
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav" style={{ fontWeight: "bold" }}>
            <li className="nav-item active">
              <a
                className="nav-link"
                style={{ color: "black" }}
                href="/homepage"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={{ color: "black" }} href="/orders">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ color: "black" }}
                href="/artists"
              >
                Artists
              </a>
            </li>
            {username && (
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ color: "#c0392b" }}
                  onClick={handleLogout}
                  href="#"
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ color: "black", marginLeft: "1000px" }}
              >
                {username ? `Welcome, ${username}` : "Welcome, Guest"}
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
