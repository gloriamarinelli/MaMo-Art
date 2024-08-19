import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const endpoint = "http://localhost:5000";

function ArtistPaintings() {
  const { artistName } = useParams();
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await fetch(
          `${endpoint}/getArtistsPaintings?name=${artistName}`
        );
        const data = await response.json();
        if (data.paintings && data.paintings.length > 0) {
          setPaintings(data.paintings);
        } else {
          setError("No paintings found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, [artistName]);

  if (loading) {
    return (
      <CircularProgress
        style={{
          color: "#ff7f50",
          marginTop: "20px",
          marginBottom: "20px",
        }}
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
      <div>
        <h1 style={{ padding: "40px" }}>
          Paintings by <span style={{ color: "#ff7f50" }}>{artistName}</span>
        </h1>
        <hr />
      </div>
      <div style={{ padding: "20px" }}>
        <Grid container spacing={3}>
          {paintings.map((painting, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent style={{ textAlign: "left" }}>
                  <h3 style={{ fontWeight: "bold", color: "#ff7f50" }}>
                    "{painting.title}"
                  </h3>
                  <Typography variant="body2">
                    <strong>Date:</strong> {painting.date || "N/A"}
                    <br />
                    <strong>Medium:</strong> {painting.medium || "N/A"}
                    <br />
                    <strong>Dimensions:</strong> {painting.dimensions || "N/A"}
                    <br />
                    <strong>Acquisition Date:</strong>{" "}
                    {formatDate(painting.acquisition_date) || "N/A"}
                    <br />
                    <strong>Credit:</strong> {painting.credit || "N/A"}
                    <br />
                    <strong>Catalogue:</strong> {painting.catalogue || "N/A"}
                    <br />
                    <strong>Department:</strong> {painting.department || "N/A"}
                    <br />
                    <strong>Classification:</strong>{" "}
                    {painting.classification || "N/A"}
                    <br />
                    <strong>Object Number:</strong>{" "}
                    {painting.object_number || "N/A"}
                    <br />
                    <strong>Diameter (cm):</strong>{" "}
                    {painting.diameter_cm || "N/A"}
                    <br />
                    <strong>Circumference (cm):</strong>{" "}
                    {painting.circumference_cm || "N/A"}
                    <br />
                    <strong>Height (cm):</strong> {painting.height_cm || "N/A"}
                    <br />
                    <strong>Length (cm):</strong> {painting.length_cm || "N/A"}
                    <br />
                    <strong>Width (cm):</strong> {painting.width_cm || "N/A"}
                    <br />
                    <strong>Depth (cm):</strong> {painting.depth_cm || "N/A"}
                    <br />
                    <strong>Weight (kg):</strong> {painting.weight_kg || "N/A"}
                    <br />
                    <strong>Duration (s):</strong>{" "}
                    {painting.duration_s || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

export default ArtistPaintings;
