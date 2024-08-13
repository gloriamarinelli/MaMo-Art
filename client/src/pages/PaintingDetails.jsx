import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import { CircularProgress } from "@mui/material";

const endpoint = "http://localhost:5000";

function PaintingDetails() {
  const { id } = useParams(); 
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const response = await fetch(`${endpoint}/getPaintingsByIndex?id=${id}`);
        const data = await response.json();
        setPainting(data.painting);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPainting();
  }, [id]);

  

  return (
    <>
      <Navbar />
      {loading && (
          <CircularProgress
            style={{
              color: "#ff7f50",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />
        )}
      <div>
        <h1>{painting.title}</h1>
        <p><strong>Name:</strong> {painting.name}</p>
        <p><strong>Date:</strong> {painting.date}</p>
        <p><strong>Medium:</strong> {painting.medium}</p>
        <p><strong>Dimensions:</strong> {painting.dimensions}</p>
        <p><strong>Acquisition Date:</strong> {painting.acquisitionDate}</p>
        <p><strong>Credit:</strong> {painting.credit}</p>
        <p><strong>Catalogue:</strong> {painting.catalogue}</p>
        <p><strong>Department:</strong> {painting.department}</p>
        <p><strong>Classification:</strong> {painting.classification}</p>
        <p><strong>Object Number:</strong> {painting.objectNumber}</p>
        <p><strong>Diameter (cm):</strong> {painting.diameter}</p>
        <p><strong>Circumference (cm):</strong> {painting.circumference}</p>
        <p><strong>Height (cm):</strong> {painting.height}</p>
        <p><strong>Length (cm):</strong> {painting.length}</p>
        <p><strong>Width (cm):</strong> {painting.width}</p>
        <p><strong>Depth (cm):</strong> {painting.depth}</p>
        <p><strong>Weight (kg):</strong> {painting.weight}</p>
        <p><strong>Duration (s):</strong> {painting.duration}</p>
      </div>
    </>
  );
}

export default PaintingDetails;
