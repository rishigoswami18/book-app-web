// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
//import {StarBackground} from "./components/StarsBackground";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
