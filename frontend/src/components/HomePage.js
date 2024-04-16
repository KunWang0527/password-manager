import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import '../assets/HomePage.css'; 



const HomePage = () => {
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
    }
  }, [location]);
  
  return (
    <div className="home-container"> 
      <Container>
        {alertMessage && <Alert variant="warning">{alertMessage}</Alert>}
        <div className="hero-section"> 
          <h1 className="hero-title"><strong>Manage Your Passwords with Ease</strong></h1>
          <p className="hero-description">
            Store, manage, and share your passwords securely in one centralized place.
          </p>
          <div className='button-group'> 
            <Button className="glowing-btn" as={Link} to="/login">Log In</Button>
            <Button className="glowing-btn" id="b2"as={Link} to="/register">Register</Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
