import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PaintingDetails from "./pages/PaintingDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/homepage/paintingDetails/:id" element={<PaintingDetails />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
