import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import UpdatePasswordModal from './UpdatePasswordModal';
import SharePasswordModal from './SharePasswordModal';
import { togglePasswordVisibility, handleCopyToClipboard } from '../utils/passwordUtilities';
import { makeApiRequest } from '../utils/api';  


const MyPasswordEntries = ({ onOpenModal, showActions = true }) => {
  const { token } = useAuth();
  const [userPasswords, setUserPasswords] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ id: '', website: '', username: '', password: '' });
  const [shareWithEmail, setShareWithEmail] = useState('');

  useEffect(() => {

    if (token) {
      makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/`, 'GET', token)
        .then(data => setUserPasswords(data.passwords))
        .catch(error => console.error("Failed to fetch user passwords:", error));
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this password entry?");
    if (confirmDelete) {
      try {
        await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${id}`, 'DELETE', token);
        setUserPasswords(userPasswords.filter(entry => entry._id !== id));
      } catch (error) {
        console.error("Failed to delete password entry:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    try {
      const updatedData = await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${currentEntry.id}`, 'PUT', token, currentEntry);
      setUserPasswords(prev => prev.map(entry => entry._id === updatedData.passwordEntry.id ? updatedData.passwordEntry : entry));
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Failed to update password entry:", error);
    }
  };

  const handleShare = async () => {
    try {
      await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/shares/${currentEntry.id}/share`, 'POST', token, { emailToShareWith: shareWithEmail });
      alert('Password shared successfully');
      setShowShareModal(false);
    } catch (error) {
      console.error("Failed to share password entry:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3>My Passwords</h3>
      <ul>
        {userPasswords.map(entry => (
          <li key={entry._id}>
            <strong>Website:</strong> {entry.website}<br />
            {entry.username && <><strong>Username:</strong> {entry.username}<br /></>}
            <strong>Password:</strong> {visiblePasswords[entry._id] ? entry.password : '****'}
            <Button onClick={() => setVisiblePasswords(togglePasswordVisibility(visiblePasswords, entry._id))} variant="outline-success">
              {visiblePasswords[entry._id] ? 'Hide' : 'Show'}
            </Button>
            <Button onClick={() => handleCopyToClipboard(visiblePasswords[entry._id] ? entry.password : 'Password hidden')} variant="outline-info">Copy</Button>
            {showActions && (
                            <>
                                <Button onClick={() => showUpdateModal(entry)} variant="outline-warning">Update</Button>
                                <Button onClick={() => handleDelete(entry._id)} variant="outline-danger">Delete</Button>
                                <Button onClick={() => showShareModal(entry._id)} variant="outline-primary">Share</Button>
                            </>
                        )}
            <br />
            <small>Last updated: {new Date(entry.updatedAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
      <UpdatePasswordModal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} currentEntry={currentEntry} handleChange={handleChange} handleSubmit={handleUpdate} />
      <SharePasswordModal show={showShareModal} onHide={() => setShowShareModal(false)} email={shareWithEmail} setEmail={setShareWithEmail} handleShare={handleShare} />
    </div>
  );
};

export default MyPasswordEntries;
