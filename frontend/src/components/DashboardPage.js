import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import MyPasswordEntry from './MyPasswordEntries';
import SharedWithMe from './ShareWithMe';

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { message: 'You need to be logged in to access the dashboard.' } });
    }
  }, [user, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
};

  return (
    <Container className="my-3">
      <h2>Dashboard</h2>
      <Form onSubmit={handleSearch}>
            <Form.Control
                type="text"
                placeholder="Search passwords"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Search</Button>
        </Form>

      <MyPasswordEntry showActions={false} />
      <SharedWithMe />
    </Container>
);
}

export default DashboardPage;
