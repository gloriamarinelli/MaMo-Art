import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import Select from "react-select"; // Import react-select
import { CircularProgress } from "@mui/material";
import defaultImage from "../images/defaultPaint.png";
import "../style/homepage.css";

const endpoint = "http://localhost:5000";
const paintingsPerPage = 100;

function Homepage() {
  const [paintings, setPaintings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const paintingsToShow =
    searchTitle || searchArtist || selectedDepartment
      ? searchResults
      : paintings;
  const indexOfLastPainting = currentPage * paintingsPerPage;
  const indexOfFirstPainting = indexOfLastPainting - paintingsPerPage;
  const currentPaintings = paintingsToShow.slice(
    indexOfFirstPainting,
    indexOfLastPainting
  );
  const totalPages = Math.ceil(paintingsToShow.length / paintingsPerPage);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${endpoint}/getPaintings`);
        const data = await response.json();
        setPaintings(data.paintings);
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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartment = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setCurrentPage(1);
    handleSearch();
  };

  const resetFilters = () => {
    setSearchTitle("");
    setSearchArtist("");
    setSelectedDepartment(null);
    setSearchResults([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTitleClick = (id) => {
    navigate(`/homepage/paintingDetails/${id}`);
  };

  return (
    <>
      <Navbar />
      <div>
        <h1
          style={{
            padding: "40px",
          }}
        >
          Welcome to the MaMoArt Paintings!
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
              gap: "10px", // Add some space between buttons
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

        {!loading && !error && (
          <div>
            <div className="paintings-grid">
              {currentPaintings.map((painting) => (
                <div
                  className="blog-card"
                  key={painting.id}
                  style={{ width: "100%" }}
                >
                  <div className="meta">
                    <img
                      src={defaultImage}
                      alt={painting.title}
                      height="100px"
                    />
                  </div>
                  <div className="description">
                    <button
                      className="underline"
                      style={{
                        textDecoration: "none",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleTitleClick(painting.id)}
                    >
                      <p
                        style={{
                          fontFamily: "Fira Sans Extra Condensed, sans-serif",
                          textTransform: "uppercase",
                          color: "#ff7f50",
                          margin: 0,
                        }}
                      >
                        "{painting.title}"
                      </p>
                    </button>
                    <p
                      style={{
                        fontFamily: "Fira Sans Extra Condensed, sans-serif",
                      }}
                    >
                      {painting.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
