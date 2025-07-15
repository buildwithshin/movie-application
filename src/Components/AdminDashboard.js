import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', director: '', year: '', description: '', genre: '' });
  const [editMovie, setEditMovie] = useState({ id: '', title: '', director: '', year: '', description: '', genre: '', comments: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:4000/movies/getMovies', {
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

  const handleAddMovie = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('https://movie-catalog-api-zwov.onrender.com/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Movie added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setNewMovie({ title: '', director: '', year: '', description: '', genre: '' });
        fetchMovies();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to add movie.',
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

  const handleUpdateMovie = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`https://movie-catalog-api-zwov.onrender.com/movies/updateMovie/${editMovie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editMovie),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Movie updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setShowModal(false);
        setEditMovie({ id: '', title: '', director: '', year: '', description: '', genre: '', comments: [] });
        fetchMovies();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to update movie.',
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

  const handleDeleteMovie = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`https://movie-catalog-api-zwov.onrender.com/movies/deleteMovie/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Movie deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        fetchMovies();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Unable to delete movie.',
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
    setExpandedComments((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div>
          <h3>Add New Movie</h3>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                placeholder="Enter movie title"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                placeholder="Enter movie director"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={newMovie.year}
                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                placeholder="Enter movie year"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                placeholder="Enter movie description"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                placeholder="Enter movie genre"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddMovie}>Add Movie</Button>
          </Form>

          <h3 className="mt-5">Movie List</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Description</th>
                <th>Genre</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>{movie.year}</td>
                  <td>{movie.description}</td>
                  <td>{movie.genre}</td>
                  <td>
                    {movie.comments.length > 0 ? (
                      <Button onClick={() => toggleComments(movie._id)}>
                        {expandedComments[movie._id] ? 'Hide Comments' : 'View Comments'}
                      </Button>
                    ) : (
                      <p>No comments</p>
                    )}
                    {expandedComments[movie._id] && (
                      <ul>
                        {movie.comments.map((comment, index) => (
                          <li key={index}>{comment}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setEditMovie({ id: movie._id, title: movie.title, director: movie.director, year: movie.year, description: movie.description, genre: movie.genre, comments: movie.comments });
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteMovie(movie._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMovie.title}
                    onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Director</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMovie.director}
                    onChange={(e) => setEditMovie({ ...editMovie, director: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={editMovie.year}
                    onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editMovie.description}
                    onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMovie.genre}
                    onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleUpdateMovie}>Update Movie</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
}
