import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import logo from '../assets/password-manager.png';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
      <Navbar.Brand as={Link} to="/"> <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Password Manager logo" /> {' '}Password Manager </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            {user && <Nav.Link as={Link} to="/mypasswords">Password Center</Nav.Link>}
            {user && <Nav.Link as={Link} to="/profile">Account Settings</Nav.Link>}
            {user && <Nav.Link as={Link} to="/share-requests">Sharing Requests</Nav.Link>}
          </Nav>
          <Nav className="justify-content-end align-items-center">
            {user ? (
                <>
                <Navbar.Text>
                  Hi, <strong>{user.username}</strong>
                </Navbar.Text>
                <Button variant="outline-info" onClick={logout} className="ms-3">Logout</Button>
                </>
            ) : (
              <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/register" className="nav-link">Register</NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
