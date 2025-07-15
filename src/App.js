import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './Components/AppNavbar';
import AdminDashboard from './Components/AdminDashboard';
import UserDashboard from './Components/UserDashboard'; // User Dashboard for regular users
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './Register/Register';
import Login from './Login/Login';
import Home from './Home/Home';

function App() {
  const [authState, setAuthState] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthState(true);
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user data
      setUserRole(user.role); // Assuming the role is stored in the JWT
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthState(false);
    setUserRole('');
  };

  return (
    <Router>
      <AppNavbar authState={authState} handleLogout={handleLogout} userRole={userRole} />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setAuthState={setAuthState} />} />
          <Route
            path="/movies"
            element={authState ? (userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />) : <Login />}
          />  {/* Admin Route for admins and User Route for regular users */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
