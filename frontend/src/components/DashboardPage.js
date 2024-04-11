import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';


const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [userPasswords, setUserPasswords] = useState([]);
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
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
            {userPasswords.map((entry, index) => (
              <li key={index}>
                <strong>Website:</strong> {entry.website} <br />
                <strong>Password:</strong> {entry.password}
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
          Website: {password.website}, Username: {password.username}
          {/* Add more details as needed */}
        </li>
      ))
    ) : (
      <p>No shared passwords.</p>
    )}
  </ul>
</div>
    </Container>
  );
};

export default DashboardPage;
