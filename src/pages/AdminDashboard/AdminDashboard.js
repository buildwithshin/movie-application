import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const notyf = new Notyf();

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    year: '',
    genre: '',
    description: ''
  });

  // Fetch all movies
  const fetchMovies = () => {
    fetch('https://api-two-myu4.onrender.com/movies/getMovies')
      .then(res => res.json())
      .then(data => {
        if (data.movies) setMovies(data.movies);
      })
      .catch(() => notyf.error('Failed to fetch movies.'));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = (e) => {
    e.preventDefault();

    const { title, director, year, genre, description } = formData;
    if (!title || !director || !year || !genre || !description) {
      return notyf.error('Please fill out all fields');
    }

    fetch('https://api-two-myu4.onrender.com/movies/addMovie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          // Show success Swal
          Swal.fire({
            title: 'Success!',
            text: 'Movie added successfully!',
            icon: 'success',
            confirmButtonColor: '#ff3b30',
          });
          fetchMovies();
          setFormData({ title: '', director: '', year: '', genre: '', description: '' });
          setShowModal(false);
        } else {
          notyf.error('Error adding movie');
        }
      })
      .catch(() => notyf.error('Server error'));
  };

  return (
    <div className="dashboard-container p-3">
      <Card className="admin-dashboard-card shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{ color: 'red' }}>Admin Dashboard</h2>
            <Button id="addMovie" variant="danger" onClick={() => setShowModal(true)}>
              Add Movie
            </Button>
          </div>

          <Table striped bordered hover variant="light">
            <thead className="text-center" style={{ backgroundColor: 'red', color: 'white' }}>
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map(movie => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No movies available.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Movie Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMovie}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control 
                name="director" 
                value={formData.director} 
                onChange={handleChange} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control 
                type="number" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control 
                name="genre" 
                value={formData.genre} 
                onChange={handleChange} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
