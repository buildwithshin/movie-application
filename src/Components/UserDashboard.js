import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function UserDashboard() {
  const [movies, setMovies] = useState([]);
  const [comments, setComments] = useState({});  // Track comment for each movie
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('https://movie-catalog-api-zwov.onrender.com/movies/getMovies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMovies(result.movies);
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to fetch movies.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (movieId) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`hhttps://movie-catalog-api-zwov.onrender.com/movies/getComments/${movieId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setExpandedComments((prevState) => ({
          ...prevState,
          [movieId]: result.comments,
        }));
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to fetch comments.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleAddComment = async (movieId) => {
    const token = localStorage.getItem('authToken');
    if (!token || !comments[movieId]) return;

    const comment = { comment: comments[movieId] };

    try {
      const response = await fetch(`https://movie-catalog-api-zwov.onrender.com/movies/addComment/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Comment added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setComments((prevState) => ({ ...prevState, [movieId]: '' })); // Reset input for specific movie
        fetchMovies(); // Refresh the movie list to show the latest comments
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to add comment.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const toggleComments = (movieId) => {
    if (!expandedComments[movieId]) {
      fetchComments(movieId);
    } else {
      setExpandedComments((prevState) => ({
        ...prevState,
        [movieId]: null,
      }));
    }
  };

  const handleCommentChange = (movieId, value) => {
    setComments((prevState) => ({
      ...prevState,
      [movieId]: value,  // Update comment for specific movie
    }));
  };

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Comments</th>
                <th>Add Comment</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>{movie.year}</td>
                  <td>{movie.genre}</td>
                  <td>
                    <Button variant="link" onClick={() => toggleComments(movie._id)}>
                      {expandedComments[movie._id] ? 'Hide Comments' : 'View Comments'}
                    </Button>
                    {expandedComments[movie._id] && (
                      <ul>
                        {expandedComments[movie._id].map((commentObj, index) => (
                          <li key={index}>{commentObj.comment}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={comments[movie._id] || ''}
                      onChange={(e) => handleCommentChange(movie._id, e.target.value)}
                      placeholder="Add a comment"
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleAddComment(movie._id)}
                    >
                      Add Comment
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
