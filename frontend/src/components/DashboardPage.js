import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import MyPasswordEntry from './MyPasswordEntries';
import SharedWithMe from './ShareWithMe';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);
  const [shareWithEmail, setShareWithEmail] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { message: 'You need to be logged in to access the dashboard.' } });
    }
  }, [user, navigate]);

  const handleOpenModal = (passwordId) => {
    setSelectedPasswordId(passwordId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShareWithEmail('');
  };

  const handleSharePassword = async (shareWithEmail) => {
    if (!shareWithEmail) {
      alert('Please enter a user email to share with.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shares/${selectedPasswordId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ emailToShareWith: shareWithEmail }),
      });

      const data = await response.json();  // Decode JSON response
      if (!response.ok) {
        console.error('Failed to share password entry:', data);
        throw new Error(data.message || 'Failed to share password entry');
      }

      alert('Password shared successfully');
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="my-3">
      <h2>Dashboard</h2>
      <div className="d-flex justify-content-between">
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
      <MyPasswordEntry onOpenModal={handleOpenModal} />
      <SharedWithMe onOpenModal={handleOpenModal} />

      {/* Modal for sharing a password */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email to share with:</Form.Label>
              <Form.Control
                type="email"
                value={shareWithEmail}
                onChange={(e) => setShareWithEmail(e.target.value)}
                placeholder="Enter user's email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSharePassword(shareWithEmail)}>
            Share Password
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardPage;
