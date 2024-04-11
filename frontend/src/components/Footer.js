import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
  return (
    <Navbar fixed="bottom" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          Password Manager © 2024
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Footer;
