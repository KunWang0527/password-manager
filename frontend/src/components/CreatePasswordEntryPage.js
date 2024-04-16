import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const CreatePasswordEntryPage = () => {
  const [formData, setFormData] = useState({
    website: '',
    username: '', 
    password: '', 
    alphabet: false,
    numerals: false,
    symbols: false,
    length: 12, 
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!formData.website) {
      setMessage({ type: 'danger', content: 'URL is required.' });
      return;
    }
    if (!formData.password && !(formData.alphabet || formData.numerals || formData.symbols)) {
      setMessage({ type: 'danger', content: 'Please provide a password or select criteria for generating one.' });
      return;
    }
    if (!formData.password && (formData.length < 4 || formData.length > 50)) {
      setMessage({ type: 'danger', content: 'Password length must be between 4 and 50.' });
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create password entry');
      }
  
      setMessage({ type: 'success', content: 'Password entry created successfully!' });
      navigate('/dashboard'); 
    } catch (error) {
      setMessage({ type: 'danger', content: error.message || 'Failed to create password entry. Please try again.' });
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create Password Entry</h2>
      {message.content && <Alert variant={message.type}>{message.content}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="website">
          <Form.Label>Website URL (Format: www.xxx.com)</Form.Label>
          <Form.Control
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username (optional)</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to generate"
          />
        </Form.Group>

        <Form.Group controlId="alphabet">
          <Form.Check
            type="checkbox"
            label="Include Alphabet"
            name="alphabet"
            checked={formData.alphabet}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="numerals">
          <Form.Check
            type="checkbox"
            label="Include Numerals"
            name="numerals"
            checked={formData.numerals}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="symbols">
          <Form.Check
            type="checkbox"
            label="Include Symbols"
            name="symbols"
            checked={formData.symbols}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="length">
          <Form.Label>Password Length</Form.Label>
          <Form.Control
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            min="4"
            max="50"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">Create Entry</Button>
      </Form>
    </Container>
  );
};

export default CreatePasswordEntryPage;
