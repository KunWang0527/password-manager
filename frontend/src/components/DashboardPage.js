import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Badge } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import SharedWithMe from './ShareWithMe';
import MyPasswordEntries from './MyPasswordEntries';
import '../assets/LoginPage.css';
import '../assets/PasswordEntryCard.css';
import '../assets/DashboardPage.css';


const DashboardPage = () => {
  const { user,token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);



  useEffect(() => {
    if (!user) {
      alert('You need to be logged in to access the dashboard.');
      navigate('/');
    } else {
      fetchPendingShareRequests();
    }
  }, [user, token, navigate]); 


  const fetchPendingShareRequests = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shares/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch share requests');
      }

      const pendingRequests = await response.json();
      setPendingRequests(pendingRequests); 

    } catch (error) {
      console.error("Failed to fetch share requests:", error);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
};

return (
  <Container className="my-3 ">
      {pendingRequests.length > 0 && (
          <div>
              <Link to="/share-requests">
                  <Badge bg="info">
                      You have {pendingRequests.length} new share requests
                  </Badge>
              </Link>
          </div>
      )}
      <Form className="d-flex dark-theme-container search-form"onSubmit={handleSearch}>
        <div class="search-container">
          <Form.Control id="b1"
              type="text"
              placeholder="Search passwords"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="me-2 flex-grow-1"
          />
          <Button type="submit" className="glowing-btn" id='b5'>Search</Button>
          </div>
      </Form>
      <MyPasswordEntries showProfile={false} showActions={['show', 'copy']} />
      <SharedWithMe />
  </Container>
);
}

export default DashboardPage;
