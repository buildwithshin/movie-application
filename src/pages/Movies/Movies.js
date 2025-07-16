// src/pages/Movies/Movies.js
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import UserView from '../../Components/UserView/UserView';
import AdminView from '../../Components/AdminView/AdminView';

export default function Movies() {
  const { user, token } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('https://api-two-myu4.onrender.com/movies/getMovies', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [token]);

  if (loading) return <div className="container my-5"><h2>Loading movies...</h2></div>;
  if (error) return <div className="container my-5"><h2>Error: {error}</h2></div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Welcome to Movie Portal!</h1>
      {
        user && user.isAdmin
          ? <AdminView moviesData={movies} />
          : <UserView moviesData={movies} />
      }
    </div>
  );
}
