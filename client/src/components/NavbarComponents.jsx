import React, { useState } from "react";
import image from "../images/MaMo.png";
import "bootstrap/dist/css/bootstrap.css";

function Navbar() {
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <img
          src={image}
          width="150"
          height="150"
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
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="/homepage">
                Home 
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
              Orders
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
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
