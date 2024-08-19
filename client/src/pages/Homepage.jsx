import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import Select from "react-select";
import {
  CircularProgress,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import defaultImage from "../images/defaultPaint.png";
import "../style/homepage.css";

const endpoint = "http://localhost:5000";

function Homepage() {
  const [paintings, setPaintings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const paintingsPerPage = 100;

  const paintingsToShow =
    searchTitle || searchArtist || selectedDepartment
      ? searchResults
      : paintings;
  const startIndex = (page - 1) * paintingsPerPage;
  const endIndex = Math.min(
    startIndex + paintingsPerPage,
    paintingsToShow.length
  );
  const currentPaintings = paintingsToShow.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${endpoint}/getPaintings`);
        const data = await response.json();
        if (data.paintings && data.paintings.length > 0) {
          setPaintings(data.paintings);
          setTotalPages(Math.ceil(data.paintings.length / paintingsPerPage));
        } else {
          setError("No paintings found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${endpoint}/getDepartments`);
        const data = await response.json();
        if (data.status === 200) {
          const departments = data.departments.map((dep) => ({
            value: dep,
            label: dep,
          }));
          setDepartments(departments);
        } else {
          setError("Failed to fetch departments.");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPaintings();
    fetchDepartments();
  }, []);

  const handleSearch = async () => {
    if (!searchTitle.trim() && !searchArtist.trim() && !selectedDepartment) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      let searchUrl = `${endpoint}/getPaintingsFilter?`;
      if (searchTitle.trim()) {
        searchUrl += `title=${encodeURIComponent(searchTitle.trim())}&`;
      }
      if (selectedDepartment) {
        searchUrl += `department=${encodeURIComponent(
          selectedDepartment.value
        )}&`;
      }
      if (searchArtist.trim()) {
        searchUrl += `name=${encodeURIComponent(searchArtist.trim())}&`;
      }

      searchUrl = searchUrl.endsWith("&") ? searchUrl.slice(0, -1) : searchUrl;

      const response = await fetch(searchUrl);
      const data = await response.json();
      setSearchResults(data.paintings);
      setTotalPages(Math.ceil(data.paintings.length / paintingsPerPage));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartment = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    handleSearch();
  };

  const resetFilters = () => {
    setSearchTitle("");
    setSearchArtist("");
    setSelectedDepartment(null);
    setSearchResults([]);
    setPage(1);
  };

  const handleTitleClick = (id) => {
    navigate(`/homepage/paintingDetails/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Navbar />
      <div>
        <h1 style={{ padding: "40px" }}>
          Welcome to the <span style={{ color: "#ff7f50" }}>MaMo Art</span>{" "}
          gallery!
        </h1>
        <hr />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
            gap: "10px",
            marginLeft: "20px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{
              width: "50%",
              padding: "10px",
              fontSize: "13px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <Select
            options={departments}
            placeholder="Select a department..."
            isClearable
            value={selectedDepartment}
            onChange={handleDepartment}
            styles={{
              container: (base) => ({
                ...base,
                width: "50%",
                fontSize: "13px",
              }),
              placeholder: (base) => ({
                ...base,
                textAlign: "left",
              }),
              singleValue: (base) => ({
                ...base,
                textAlign: "left",
              }),
              input: (base) => ({
                ...base,
                textAlign: "left",
              }),
            }}
          />
          <input
            type="text"
            placeholder="Search by artist..."
            value={searchArtist}
            onChange={(e) => setSearchArtist(e.target.value)}
            style={{
              width: "50%",
              padding: "10px",
              fontSize: "13px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "50%",
            }}
          >
            <button
              onClick={handleSearch}
              style={{
                padding: "10px",
                fontSize: "15px",
                borderRadius: "5px",
                backgroundColor: "#ff7f50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                flex: "1",
              }}
            >
              Search
            </button>
            <button
              onClick={resetFilters}
              style={{
                padding: "10px",
                fontSize: "15px",
                borderRadius: "5px",
                backgroundColor: "#ff7f50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                flex: "1",
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading && (
          <CircularProgress
            style={{
              color: "#ff7f50",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />
        )}
        {error && <p>Error fetching paintings: {error}</p>}

        {!loading && paintingsToShow.length === 0 && (
          <b style={{ fontSize: "18px" }}>
            No paintings found. Try a different search.
          </b>
        )}

        {!loading && !error && (
          <div>
            <Grid container spacing={2} justifyContent="center">
              {currentPaintings.map((painting, index) => (
                <Grid item xs={12} sm={6} md={4} key={startIndex + index}>
                  <Card
                    sx={{
                      width: "80%",
                      cursor: "pointer",
                      marginLeft: "30px",
                      marginTop: "10px",
                    }}
                    onClick={() => handleTitleClick(painting.id)}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={defaultImage}
                      alt={painting.title}
                      sx={{ objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#ff7f50",
                          fontFamily: "Fira Sans Extra Condensed, sans-serif",
                          textTransform: "uppercase",
                          mb: 1,
                          fontSize: "15px",
                        }}
                      >
                        "{painting.title}"
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: "Fira Sans Extra Condensed, sans-serif",
                        }}
                      >
                        {painting.name}
                      </Typography>
                    </CardContent>
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
                marginBottom: "20px",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
