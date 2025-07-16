// src/components/UserView/UserView.js
import React, { useEffect, useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';

export default function UserView({ moviesData }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(moviesData);
  }, [moviesData]);

  return (
    <div className="row">
      {movies.map((movie) => (
        <div className="col-md-4" key={movie._id || movie.title}>
          <MovieCard movieProp={movie} />
        </div>
      ))}
    </div>
  );
}
