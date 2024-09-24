import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const endpoint = "http://localhost:5000";

function ArtistPaintings() {
  const { artistName } = useParams();
  const [paintings, setPaintings] = useState([]);
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await fetch(
          `${endpoint}/getPaintingsArtistCollection?name=${artistName}`
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

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await fetch(`${endpoint}/getBio?name=${artistName}`);
        const data = await response.json();
        if (data.artist) {
          setBio(data.artist);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
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
          {bio ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {bio.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Nationality:</strong> {bio.nationality || "N/A"}
                    <br />
                    <strong>Gender:</strong> {bio.gender || "N/A"}
                    <br />
                    <strong>Birth Year:</strong> {bio.birth_year || "N/A"}
                    <br />
                    <strong>Death Year:</strong> {bio.death_year || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : error ? (
            <Typography
              variant="h6"
              style={{ textAlign: "center", padding: "20px", width: "100%" }}
            >
              {error}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              style={{ textAlign: "center", padding: "20px", width: "100%" }}
            >
              No bio found for{" "}
              <span style={{ color: "#ff7f50" }}>{artistName}</span>.
            </Typography>
          )}
        </Grid>

        <div style={{ padding: "20px 0", textAlign: "left" }}>
          <Typography variant="h8">
            There are <b>{paintings.length}</b> paintings.
          </Typography>
        </div>

        <Grid className="mt-2" container spacing={3}>
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
                    {painting.acquisition_date || "N/A"}
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
