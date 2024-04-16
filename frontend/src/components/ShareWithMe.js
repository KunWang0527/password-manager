import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PasswordEntryCard from './PasswordEntryCard'; 
import {handleCopyToClipboard } from '../utils/passwordUtilities';
import './PasswordEntryCard.css';
import { Container, Row, Col } from 'react-bootstrap';


const SharedWithMe = () => {
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchSharedPasswords = async () => {
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
    };

    if (user && token) {
      fetchSharedPasswords();
    }
  }, [user, token]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="mt-4">
      <h3>Shared With Me</h3>
      <Container>
      <Row xs={1} md={4} >
      {sharedPasswords.length > 0 ? (
        sharedPasswords.map((password, index) => (
            <Col><PasswordEntryCard
                key={password._id + index} 
                entry={password}
                isVisible={visiblePasswords[password._id] || false}
                onToggleVisibility={togglePasswordVisibility}
                onCopyPassword={handleCopyToClipboard}
                sharedBy={password.sharedBy} 
                showActions={['show', 'copy']}
            />    
            </Col>
        ))
      ) : (
        <p>No shared passwords.</p>
      )}
      </Row>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      </Container>
    </div>
  );
};

export default SharedWithMe;
