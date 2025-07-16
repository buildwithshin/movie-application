import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import './AdminView.css';

export default function AdminView() {
  const notyf = new Notyf();

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const fetchAllMovies = () => {
    fetch('https://api-two-myu4.onrender.com/movies/getMovies')
      .then(res => res.json())
      .then(data => {
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      })
      .catch(() => notyf.error('Failed to fetch movies.'));
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const handleShow = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setTitle(movie.title);
      setDirector(movie.director);
      setYear(movie.year);
      setGenre(movie.genre);
      setDescription(movie.description);
    } else {
      setEditingMovie(null);
      setTitle('');
      setDirector('');
      setYear('');
      setGenre('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingMovie(null);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title || !director || !year || !genre || !description) {
      notyf.error('Please fill in all fields.');
      return;
    }

    const movieData = {
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year),
      genre: genre.trim(),
      description: description.trim()
    };

    try {
      const response = await fetch('https://api-two-myu4.onrender.com/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (response.ok) {
        // SweetAlert on successful movie addition
        Swal.fire({
          title: 'Success!',
          text: 'Movie added successfully!',
          icon: 'success',
          confirmButtonColor: '#ff3b30',
        });
        fetchAllMovies();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to add movie.');
      }
    } catch (err) {
      console.error('Error:', err);
      notyf.error('Server error while adding movie.');
    }
  };

  const updateMovie = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const movieData = {
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year),
      genre: genre.trim(),
      description: description.trim()
    };

    try {
      const response = await fetch(`https://api-two-myu4.onrender.com/movies/updateMovie/${editingMovie._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (response.ok) {
        // SweetAlert on successful movie update
        Swal.fire({
          title: 'Success!',
          text: 'Movie updated successfully!',
          icon: 'success',
          confirmButtonColor: '#ff3b30',
        });
        fetchAllMovies();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update movie.');
      }
    } catch (err) {
      console.error('Error:', err);
      notyf.error('Server error while updating movie.');
    }
  };

  const deleteMovie = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Delete this movie?')) {
      fetch(`https://api-two-myu4.onrender.com/movies/deleteMovie/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(() => {
          // SweetAlert on successful movie deletion
          Swal.fire({
            title: 'Deleted!',
            text: 'Movie deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#ff3b30',
          });
          fetchAllMovies();
        })
        .catch(() => notyf.error('Failed to delete movie.'));
    }
  };

  return (
    <div className="dashboard-container p-4">
      <Card className="admin-card shadow-sm">
        <Card.Body>
          <Row className="mb-4">
            <Col className="text-end">
              <Button variant="danger" onClick={() => handleShow()} id="addMovie">➕ Add New Movie</Button>
            </Col>
          </Row>

          <Table striped bordered responsive hover className="movie-table text-center align-middle">
            <thead style={{ backgroundColor: 'red', color: 'white' }}>
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Description & Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.genre}</td>
                    <td className="text-start">
                      <div style={{ whiteSpace: 'pre-line' }}>{movie.description}</div>
                      <div className="mt-2">
                        <ButtonGroup size="sm">
                          <Button variant="warning" onClick={() => handleShow(movie)}>
                            <FaEdit /> Edit
                          </Button>
                          <Button variant="danger" onClick={() => deleteMovie(movie._id)}>
                            <FaTrash /> Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted">No movies found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMovie ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editingMovie ? updateMovie : addMovie}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Director</Form.Label>
              <Form.Control 
                value={director} 
                onChange={e => setDirector(e.target.value)} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control 
                type="number" 
                value={year} 
                onChange={e => setYear(e.target.value)} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control 
                value={genre} 
                onChange={e => setGenre(e.target.value)} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                style={{ borderColor: 'red' }} 
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="mt-3">
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
