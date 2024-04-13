import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link,NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Password Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
            {user && <Nav.Link as={Link} to="/mypasswords">My Passwords</Nav.Link>}
            {user && <Nav.Link as={Link} to="/create">StorePassword</Nav.Link>}
            {user && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            {user && <Nav.Link as={Link} to="/share-requests">View request</Nav.Link>}

          </Nav>
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <strong>{user.username}</strong>
                </Navbar.Text>
                <Button variant="outline-info" onClick={logout}>Logout</Button>
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
