import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarComponents";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import orderImage from "../images/orders.jpg";
import CloseIcon from "@mui/icons-material/Close";

const endpoint = "http://localhost:5000";

function Orders() {
  const username = localStorage.getItem("LoggedUser");
  const [orders, setOrders] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${endpoint}/getUserOrders?username=${username}`
        );
        const data = await response.json();
        if (response.ok) {
          setOrders(data.cart);
        } else {
          setError(data.error || "Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [username]);

  const handleOpenOrder = async (artwork_id) => {
    try {
      const response = await fetch(
        `${endpoint}/getPaintingsDetails?id=${artwork_id}`
      );
      const data = await response.json();
      if (data.paintings && data.paintings.length > 0) {
        setSelectedArtwork(data.paintings[0]);
        setOpen(true);
      } else {
        setError("No painting found");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedArtwork(null);
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

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>
          Orders of <span style={{ color: "#ff7f50" }}>{username}</span>
        </h1>
        <hr />
        {orders && orders.length > 0 ? (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.order_id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="100"
                    image={orderImage}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      Order ID: <b>{order.order_id}</b>
                    </Typography>
                    <Typography variant="body1">
                      Artwork ID:{" "}
                      <u style={{ color: "#ff7f50" }}>
                        <b
                          style={{ cursor: "pointer", color: "#ff7f50" }}
                          onClick={() => handleOpenOrder(order.artwork_id)}
                        >
                          {order.artwork_id}
                        </b>
                      </u>
                    </Typography>
                    <Typography variant="body2">
                      Date:{" "}
                      <b>{new Date(order.timestamp.$date).toLocaleString()}</b>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="h6"
            style={{ textAlign: "center", padding: "20px" }}
          >
            No orders found for{" "}
            <span style={{ color: "#ff7f50" }}>{username}</span>.
          </Typography>
        )}
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ color: "#ff7f50", textAlign: "center" }}>
          <b>Painting Details</b>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 20,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedArtwork ? (
            <div>
              <Typography variant="h6">
                <strong>Title:</strong> {selectedArtwork.title}
              </Typography>
              <hr></hr>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedArtwork.name || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {selectedArtwork.date || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Medium:</strong> {selectedArtwork.medium || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Dimensions:</strong>{" "}
                {selectedArtwork.dimensions || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Acquisition Date:</strong>{" "}
                {selectedArtwork.acquisition_date || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Credit:</strong> {selectedArtwork.credit || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Catalogue:</strong> {selectedArtwork.catalogue || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong>{" "}
                {selectedArtwork.department || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Classification:</strong>{" "}
                {selectedArtwork.classification || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Diameter (cm):</strong>{" "}
                {selectedArtwork.diameter || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Circumference (cm):</strong>{" "}
                {selectedArtwork.circumference}
              </Typography>
              <Typography variant="body1">
                <strong>Height (cm):</strong> {selectedArtwork.height || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Length (cm):</strong> {selectedArtwork.length || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Width (cm):</strong> {selectedArtwork.width || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Depth (cm):</strong> {selectedArtwork.depth || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Weight (kg):</strong> {selectedArtwork.weight || "N/A"}
              </Typography>
            </div>
          ) : (
            <Typography variant="body1">Loading details...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Orders;
