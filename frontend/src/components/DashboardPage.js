import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../context/AuthContext';


const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [userPasswords, setUserPasswords] = useState([]);
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);
  const [shareWithUserId, setShareWithUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { message: 'You need to be logged in to access the dashboard.' } });
    }
  }, [user, navigate]);

  // Fetch user passwords
  useEffect(() => {
    const fetchUserPasswords = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch passwords');
        }
        const data = await response.json();
        setUserPasswords(data.passwords);
      } catch (error) {
        console.error("Failed to fetch user passwords:", error);
      }
    };
    fetchUserPasswords();
  }, []);

  // Fetch shared passwords
  useEffect(() => {
    const fetchSharedPasswords = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/shared-with-me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch shared passwords');
        }
        const data = await response.json();
        setSharedPasswords(data.sharedPasswords);
      } catch (error) {
        console.error("Failed to fetch shared passwords:", error);
      }
    };
    fetchSharedPasswords();
  }, []);

  const handleLogout = () => {
    logout(); 
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteProfile = async () => {
    // Implement API call to delete profile
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

    const handleOpenModal = (passwordId) => {
      setSelectedPasswordId(passwordId);
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setShareWithUserId('');
    };
  
    // Function to handle the sharing of a password
    const handleSharePassword = async (shareWithUserId) => {
      if (!shareWithUserId) {
        alert('Please enter a user ID to share with.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${selectedPasswordId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userIdToShareWith: shareWithUserId }),
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
          {user && (
            <>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <Button variant="danger" onClick={handleDeleteProfile}>Delete Profile</Button>
            </>
          )}
        </div>
        <div className="mt-4">
          <h3>My Passwords</h3>
          {userPasswords && userPasswords.length > 0 ? (
            <ul>
              {userPasswords.map((entry) => (
                <li key={entry._id}>
                  <strong>Website:</strong> {entry.website}<br />
                  {entry.username && <><strong>Username:</strong> {entry.username}<br /></>}
                  <strong>Password:</strong> {visiblePasswords[entry._id] ? entry.password : '****'}
                  <button onClick={() => togglePasswordVisibility(entry._id)}>
                    {visiblePasswords[entry._id] ? 'Hide' : 'Show'}
                  </button>
                  <Button onClick={() => handleOpenModal(entry._id)} variant="primary">Share</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No passwords found.</p>
          )}
        </div>
        <div>
          <h3>Shared With Me</h3>
          <ul>
            {sharedPasswords.length > 0 ? (
              sharedPasswords.map((password) => (
                <li key={password._id}>
                  Website: {password.website}, Username: {password.username} - 
                  {visiblePasswords[password._id] ? password.password : '****'}
                  <button onClick={() => togglePasswordVisibility(password._id)}>
                    {visiblePasswords[password._id] ? 'Hide' : 'Show'}
                  </button>
                </li>
              ))
            ) : (
              <p>No shared passwords.</p>
            )}
          </ul>
        </div>
    
        {/* Modal for sharing password */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Share Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Username to share with</Form.Label>
                <Form.Control
                  type="text"
                  value={shareWithUserId}
                  onChange={(e) => setShareWithUserId(e.target.value)}
                  placeholder="Enter user ID"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={handleSharePassword}>Share Password</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
export default DashboardPage;