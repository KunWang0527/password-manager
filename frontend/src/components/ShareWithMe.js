import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from 'react-bootstrap/Button';

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
    setVisiblePasswords(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div>
      <h3>Shared With Me</h3>
      {sharedPasswords.length > 0 ? (
        <ul>
          {sharedPasswords.map((password) => (
            <li key={password._id}>
              <strong>Website:</strong> {password.website}<br />
              {password.username && <>
                <strong>Username:</strong> {password.username}<br />
              </>}
              <strong>Password:</strong> {visiblePasswords[password._id] ? password.password : '****'}
              <button onClick={() => togglePasswordVisibility(password._id)}>
                {visiblePasswords[password._id] ? 'Hide' : 'Show'}
              </button><br />
              <strong>Shared with you by:</strong> {password.sharedBy}
            </li>
          ))}
        </ul>
      ) : (
        <p>No shared passwords.</p>
      )}
    </div>
  );
};
  
export default SharedWithMe;
