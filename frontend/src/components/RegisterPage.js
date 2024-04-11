import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'; 
import { useAuth } from '../context/AuthContext'; 


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      localStorage.setItem('token', data.token); 

      login(data.user); 


      setMessage({ type: 'success', content: 'Registration successful! Redirecting to dashboard...' });
      setFormData({ email: '', username: '', password: '' });
      // Redirect user after a short delay
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage({ type: 'danger', content: error.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {message.content && (
        <Alert variant={message.type}>{message.content}</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Username form group */}
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Password form group */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <div className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </Container>
  );
};

export default RegisterPage;
