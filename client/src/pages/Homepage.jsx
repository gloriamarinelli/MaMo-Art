import { useEffect, useState } from "react";
import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/NavbarComponents";

export const HomepageEndpoint = "http://localhost:5000";

function Homepage() {
  return (
    <>
      <Navbar />
     
    </>
  );
}

export default Homepage;
