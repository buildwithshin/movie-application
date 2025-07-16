// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppNavbar from './Components/AppNavbar/AppNavbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Movies from './pages/Movies/Movies';
import Home from './pages/Home/Home';
// import Profile from './pages/Profile/Profile';
import AdminView from './Components/AdminView/AdminView'; // ✅ Fix import path
import UserContext from './context/UserContext';

function App() {
  const { user } = useContext(UserContext); // ✅ Fix user undefined

  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/movies" element={<Movies />} />
        
        {/* ✅ Admin-only protected route */}
        <Route
          path="/admin-dashboard"
          element={
            user?.isAdmin ? <AdminView /> : <Navigate to="/" replace />
          }
        />
        
        {/* Optional: 404 fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
