import React from "react";
import { Route, Routes } from "react-router-dom";
import Report from "./components/main/Report";
import Staff from "./components/main/Staff";
import Home from "./components/main/Home";
import Login from "./components/main/Login";
import Checkin from "./components/main/Checkin";
import Auth from "./hoc/Auth";
import WindowResizeHandler from "./hoc/WindowResizeHandler";
require("dotenv").config();

function App() {
  return (
    <WindowResizeHandler>
      <Auth>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/report" element={<Report />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Auth>
    </WindowResizeHandler>
  );
}

export default App;