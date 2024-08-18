import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";

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
          `${endpoint}/getPaintingsByIndex?id=${id}`
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
      <Card style={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <h1 style={{ fontWeight: "bold", color: "#ff7f50" }}>
          "{painting.title}"
        </h1>
        <CardContent style={{ textAlign: "left" }}>
          <Typography variant="body1">
            <strong>Name:</strong> {painting.name}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {painting.date}
          </Typography>
          <Typography variant="body1">
            <strong>Medium:</strong> {painting.medium}
          </Typography>
          <Typography variant="body1">
            <strong>Dimensions:</strong> {painting.dimensions}
          </Typography>
          <Typography variant="body1">
            <strong>Acquisition Date:</strong>{" "}
            {formatDate(painting.acquisition_date)}
          </Typography>
          <Typography variant="body1">
            <strong>Credit:</strong> {painting.credit}
          </Typography>
          <Typography variant="body1">
            <strong>Catalogue:</strong> {painting.catalogue}
          </Typography>
          <Typography variant="body1">
            <strong>Department:</strong> {painting.department}
          </Typography>
          <Typography variant="body1">
            <strong>Classification:</strong> {painting.classification}
          </Typography>
          <Typography variant="body1">
            <strong>Diameter (cm):</strong> {painting.diameter}
          </Typography>
          <Typography variant="body1">
            <strong>Circumference (cm):</strong> {painting.circumference}
          </Typography>
          <Typography variant="body1">
            <strong>Height (cm):</strong> {painting.height}
          </Typography>
          <Typography variant="body1">
            <strong>Length (cm):</strong> {painting.length}
          </Typography>
          <Typography variant="body1">
            <strong>Width (cm):</strong> {painting.width}
          </Typography>
          <Typography variant="body1">
            <strong>Depth (cm):</strong> {painting.depth}
          </Typography>
          <Typography variant="body1">
            <strong>Weight (kg):</strong> {painting.weight}
          </Typography>
        </CardContent>
        <CardActions>
          <div>
            <button
            //onClick={() => handlePageChange(currentPage - 1)}
            >
              ADD TO CART
            </button>
          </div>
        </CardActions>
      </Card>
    </>
  );
}

export default PaintingDetails;
