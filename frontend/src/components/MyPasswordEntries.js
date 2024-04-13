import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';

const MyPasswordEntries = ({ onOpenModal }) => {
  const { user } = useAuth();
  const [userPasswords, setUserPasswords] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

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
  }, [user]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div className="mt-4">
      <h3>My Passwords</h3>
      {userPasswords.length > 0 ? (
        <ul>
          {userPasswords.map((entry) => (
            <li key={entry._id}>
              <strong>Website:</strong> {entry.website}<br />
              {entry.username && <><strong>Username:</strong> {entry.username}<br /></>}
              <strong>Password:</strong> {visiblePasswords[entry._id] ? entry.password : '****'}
              <button onClick={() => togglePasswordVisibility(entry._id)}>
                {visiblePasswords[entry._id] ? 'Hide' : 'Show'}
              </button>
              <Button onClick={() => onOpenModal(entry._id)} variant="primary">Share</Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No passwords found.</p>
      )}
    </div>
  );
};

export default MyPasswordEntries;
