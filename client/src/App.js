import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PaintingDetails from "./pages/PaintingDetails";
import Artists from "./pages/Artists";
import ArtistPaintings from "./pages/ArtistPaintings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route
            path="/homepage/paintingDetails/:id"
            element={<PaintingDetails />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist/:artistName" element={<ArtistPaintings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
