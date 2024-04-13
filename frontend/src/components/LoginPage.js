import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      setMessage({ type: 'success', content: 'You are already logged in. Redirecting to dashboard...' });
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      setMessage({ type: 'warning', content: 'You are already logged in.' });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      setMessage({ type: 'success', content: 'Login successful! Redirecting to dashboard...' });
      setFormData({ username: '', password: '' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({ type: 'danger', content: error.message || 'Login failed. Please try again.' });
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {message.content && (
        <Alert variant={message.type}>{message.content}</Alert>
      )}
      <Form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
