import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import logo from '../assets/password-manager.png';
import '../assets/Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3 custom-navbar">
      <Container fluid>
      <Navbar.Brand as={Link} to="/"> <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Password Manager logo" /> {' '}Password Manager </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
            {user && <Nav.Link as={Link} to="/mypasswords">User Center</Nav.Link>}
            {user && <Nav.Link as={Link} to="/share-requests">Sharing Requests</Nav.Link>}
          </Nav>
          <Nav className="justify-content-end align-items-center">
            {user ? (
                <>
                <Navbar.Text className="greeting">
                  <h5><strong>Signed in as : {user.username}</strong></h5>
                </Navbar.Text>
                <Button id='b4'variant="outline-info" onClick={logout} className="ms-3 glowing-btn">Logout</Button>
                </>
            ) : (
              <div className="button-group">
              <NavLink to="/login"  className="nav-link glowing-btn">Login</NavLink>
              <NavLink to="/register" className="nav-link glowing-btn">Register</NavLink>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
