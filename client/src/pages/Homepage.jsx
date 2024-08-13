import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarComponents";
import { CircularProgress } from "@mui/material";
import defaultImage from "../images/defaultPaint.png";
import "../style/homepage.css";

const endpoint = "http://localhost:5000";
const paintingsPerPage = 100;

function Homepage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await fetch(`${endpoint}/getPaintings`);
        const data = await response.json();
        setPaintings(data.paintings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  const indexOfLastPainting = currentPage * paintingsPerPage;
  const indexOfFirstPainting = indexOfLastPainting - paintingsPerPage;
  const currentPaintings = paintings.slice(
    indexOfFirstPainting,
    indexOfLastPainting
  );

  const totalPages = Math.ceil(paintings.length / paintingsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTitleClick = (id) => {
    navigate(`/homepage/paintingDetails/${id}`); // Correct path format
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Welcome to the MaMoArt Paintings!</h1>
        <hr />
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
