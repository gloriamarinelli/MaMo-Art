import React, { useState } from "react";
import image from "../images/MaMo.png";
import "bootstrap/dist/css/bootstrap.css";

function Navbar() {
  return (
    <>
      <nav
        style={{ backgroundColor: "rgba(255, 127, 80, 0.9)" }}
        class="navbar navbar-expand-lg "
      >
        <img
          src={image}
          width="100"
          height="100"
          margin-left="200px"
          alt=""
        ></img>{" "}
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav" style={{ fontWeight: "bold" }}>
            <li class="nav-item active">
              <a class="nav-link" style={{ color: "black" }} href="/homepage">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" style={{ color: "black" }} href="#">
                Orders
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" style={{ color: "black" }} href="#">
                Account
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
