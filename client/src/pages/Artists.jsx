import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  CardActions,
  Button,
  Box,
} from "@mui/material";

const endpoint = "http://localhost:5000";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const artistsPerPage = 100;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(`${endpoint}/getArtists`);
        const data = await response.json();
        if (data.artists && data.artists.length > 0) {
          setArtists(data.artists);
          setTotalPages(Math.ceil(data.artists.length / artistsPerPage));
        } else {
          setError("No artists found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const viewPaintings = (artist) => {
    navigate(`/artist/${artist}`);
  };

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

  const startIndex = (page - 1) * artistsPerPage;
  const endIndex = Math.min(startIndex + artistsPerPage, artists.length);
  const artistsToDisplay = artists.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <div>
        <h1 style={{ padding: "40px" }}>
          Artists of <span style={{ color: "#ff7f50" }}>MaMo Art</span> gallery
        </h1>
        <hr />
      </div>
      <div style={{ padding: "20px" }}>
        <Grid container spacing={3}>
          {artistsToDisplay.map((artist, index) => (
            <Grid item xs={12} sm={6} md={4} key={startIndex + index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {artist}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => viewPaintings(artist)}
                    >
                      View paintings
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        />
      </div>
    </>
  );
}

export default Artists;
