import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const isValid =
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      mobileNo.trim().length === 11 &&
      /^\d+$/.test(mobileNo); // ensure it's all numbers

    setIsActive(isValid);
  }, [firstName, lastName, email, password, mobileNo]);

  const registerUser = (e) => {
    e.preventDefault();

    fetch('https://api-two-myu4.onrender.com/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Registered successfully') {
          setFirstName('');
          setLastName('');
          setEmail('');
          setMobileNo('');
          setPassword('');

          Swal.fire({
            title: 'Success!',
            text: 'Registration successful!',
            icon: 'success',
            confirmButtonColor: '#ff3b30',
          }).then(() => navigate('/login'));
        } else if (data.message === 'User already exists') {
          Swal.fire({
            title: 'Error!',
            text: 'User already exists. Try a different email.',
            icon: 'error',
            confirmButtonColor: '#ff3b30',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Registration failed',
            icon: 'error',
            confirmButtonColor: '#ff3b30',
          });
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Server error. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#ff3b30',
        });
      });
  };

  return (
    <div className="register-bg" style={{ backgroundColor: 'white', padding: '50px' }}>
      <Form onSubmit={registerUser} className="register-form">
        <h2 className="register-title text-center" style={{ color: 'red' }}>Create Account</h2>
        <p className="register-subtitle text-center mb-4" style={{ color: 'black' }}>
          Please fill in the details below to create your account.
        </p>

        <Form.Group className="mb-3">
          <Form.Label className="register-label" style={{ color: 'black' }}>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="register-input"
            style={{ borderColor: 'red' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label" style={{ color: 'black' }}>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="register-input"
            style={{ borderColor: 'red' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label" style={{ color: 'black' }}>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            style={{ borderColor: 'red' }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label" style={{ color: 'black' }}>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter 11-digit mobile number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            maxLength={11}
            className="register-input"
            style={{ borderColor: 'red' }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="register-label" style={{ color: 'black' }}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            style={{ borderColor: 'red' }}
          />
        </Form.Group>

        <Button
          type="submit"
          className="register-btn w-100"
          style={{
            backgroundColor: 'red',
            borderColor: 'red',
            color: 'white',
          }}
          disabled={!isActive}
        >
          Register
        </Button>

        <div className="mt-3 text-center">
          <small style={{ color: 'black' }}>
            Already have an account? <Link to="/login" className="text-danger">Login</Link>
          </small>
        </div>
      </Form>
    </div>
  );
}
