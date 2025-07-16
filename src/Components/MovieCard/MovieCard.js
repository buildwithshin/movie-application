import React, { useState } from 'react';
import { Card, Button, Modal, Form, ListGroup } from 'react-bootstrap';

export default function MovieCard({ movieProp }) {
  const [show, setShow] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    "Amazing visuals and story!",
    "Best Marvel movie ever.",
    "Could watch this again and again."
  ]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { title, director, year, description, genre, imageUrl } = movieProp;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  const fallbackImage = `https://placehold.co/400x250?text=${encodeURIComponent(title)}`;

  return (
    <>
      <Card className="mb-4 shadow-sm h-100 movie-card" style={{ borderColor: '#ff0000' }}>
        <Card.Img
          variant="top"
          src={imageUrl || fallbackImage}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title>{title}</Card.Title>
            <Card.Text><strong>Year:</strong> {year}</Card.Text>
            <Card.Text><strong>Genre:</strong> {genre}</Card.Text>
          </div>
          <div className="d-grid">
            <Button variant="danger" onClick={handleShow} id="viewMovieBtn" style={{ backgroundColor: '#ff0000', borderColor: '#ff0000' }}>
              View Movie
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#ff0000', color: '#ffffff' }}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Director:</strong> {director}</p>
          <p><strong>Year:</strong> {year}</p>
          <p><strong>Genre:</strong> {genre}</p>
          <p><strong>Description:</strong> {description}</p>

          <hr />
          <h5 className="mt-4">💬 Comments</h5>
          <ListGroup className="mb-3">
            {comments.map((comment, idx) => (
              <ListGroup.Item key={idx}>{comment}</ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="danger" type="submit" size="sm" style={{ backgroundColor: '#ff0000', borderColor: '#ff0000' }}>
              Post Comment
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
