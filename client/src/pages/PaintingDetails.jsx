import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import image1 from "../images/bg.png";

const endpoint = "http://localhost:5000";

function PaintingDetails() {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const response = await fetch(
          `${endpoint}/getPaintingsDetails?id=${id}`
        );
        const data = await response.json();
        if (data.paintings && data.paintings.length > 0) {
          setPainting(data.paintings[0]);
        } else {
          setError("No painting found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPainting();
  }, [id]);

  const handleAddToOrder = async () => {
    try {
      const username = localStorage.getItem("LoggedUser");
      const order_id = generateRandomOrderId();

      const response = await fetch(`${endpoint}/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          username,
          artwork_id: id,
        }),
      });

      if (response.ok) {
        alert("Painting added to orders successfully!");
      } else {
        alert("Failed to add painting to cart");
      }
    } catch (error) {
      console.error("Error adding painting to cart", error);
    }
  };

  const generateRandomOrderId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0");
    const randomLetters = Array.from({ length: 3 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");
    return `${randomLetters}${numbers}`;
  };

  if (loading) {
    return (
      <CircularProgress
        style={{ color: "#ff7f50", marginTop: "20px", marginBottom: "20px" }}
      />
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  function formatDate(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundImage: `url(${image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Card style={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
          <h1 style={{ fontWeight: "bold", color: "#ff7f50" }}>
            "{painting.title}"
          </h1>
          <CardContent style={{ textAlign: "left" }}>
            <Typography variant="body1">
              <strong>Name:</strong> {painting.name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {painting.date || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Medium:</strong> {painting.medium || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Dimensions:</strong> {painting.dimensions || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Acquisition Date:</strong>{" "}
              {formatDate(painting.acquisition_date) || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Credit:</strong> {painting.credit || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Catalogue:</strong> {painting.catalogue || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Department:</strong> {painting.department || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Classification:</strong>{" "}
              {painting.classification || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Diameter (cm):</strong> {painting.diameter || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Circumference (cm):</strong> {painting.circumference}
            </Typography>
            <Typography variant="body1">
              <strong>Height (cm):</strong> {painting.height || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Length (cm):</strong> {painting.length || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Width (cm):</strong> {painting.width || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Depth (cm):</strong> {painting.depth || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Weight (kg):</strong> {painting.weight || "N/A"}
            </Typography>
          </CardContent>
          <CardActions>
            <div>
              <button onClick={handleAddToOrder}>ADD TO ORDER</button>
            </div>
          </CardActions>
        </Card>
      </div>
    </>
  );
}

export default PaintingDetails;
