import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const HomePage = () => {
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
    }
  }, [location]);
  return (
    <Container>
      {alertMessage && <Alert variant="warning">{alertMessage}</Alert>}
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }} className="text-center">
          <h1>Welcome to Password Manager</h1>
          <p>
            Password Manager makes it easy and secure for you to store and manage all your passwords in one place. Access your passwords anytime, anywhere, with complete security.
          </p>
          <p>
            What sets us apart? With Password Manager, you can <strong>share passwords with your friends and family safely</strong>. Our secure sharing feature ensures that you can collaborate with others without compromising on security.
          </p>
          <p>
            Ready to take control of your passwords and share them safely? Start by <Link to="/login">logging in</Link> or <Link to="/register">registering</Link> for a new account today.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
