import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import UpdatePasswordModal from './UpdatePasswordModal';
import SharePasswordModal from './SharePasswordModal';
import { togglePasswordVisibility, handleCopyToClipboard } from '../utils/passwordUtilities';
import { makeApiRequest } from '../utils/api';
import PasswordEntryCard from './PasswordEntryCard';
import './PasswordEntryCard.css';
import './MyPasswordEntries.css';


const MyPasswordEntries = ({ onOpenModal, showActions }) => {
    const { token } = useAuth();
    const [userPasswords, setUserPasswords] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
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

    const actionButtons = location.pathname === '/mypasswords'
        ? ['show', 'copy', 'update', 'delete', 'share']
        : ['show', 'copy'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleVisibility = (id) => {
    setVisiblePasswords(prev => {
        const newState = { ...prev };
        newState[id] = !newState[id];  
        return newState;
    });
};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this password entry?");
    if (confirmDelete) {
      try {
        await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${id}`, 'DELETE', token);
        setUserPasswords(userPasswords.filter(entry => entry._id !== id));
        alert('Entry deleted successfully');

      } catch (error) {
        console.error("Failed to delete password entry:", error);
      }
    }
  };

  const handleUpdate = (entry) => {
    setCurrentEntry(entry);  
    setShowUpdateModal(true);  
  }


  const handleShare = (entry) => {
    setCurrentEntry(entry);  
    setShowShareModal(true);  
  };

  const handleActualUpdate = async () => {
    try {
        const updatedData = await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${currentEntry._id}`, 'PUT', token, currentEntry);
        const updatedPasswords = userPasswords.map(entry => entry._id === currentEntry._id ? { ...entry, ...updatedData } : entry);
        setUserPasswords(updatedPasswords);
        setShowUpdateModal(false);  
        setCurrentEntry({});  
    } catch (error) {
        console.error("Failed to update password entry:", error);
    }
};

  const handleActualShare = async () => {
      try {
          await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/shares/${currentEntry._id}/share`, 'POST', token, { emailToShareWith: shareWithEmail });
          alert('Password shared successfully');
          setShowShareModal(false);  
      } catch (error) {
          console.error("Failed to share password entry:", error);
      }
  };


  return (
    <div className="mt-4">
        <h2>My Passwords:</h2>
        <Button onClick={() => navigate('/create')} variant="info" className="mb-3 button-71" >Create New Entry</Button>
        <Row xs={1} md={4} className="g-4">
            {userPasswords.map((password) => (
                <Col key={password._id}>
                  <PasswordEntryCard
                      entry={password}
                      isVisible={visiblePasswords[password._id] || false}
                      onToggleVisibility={handleToggleVisibility}
                      onCopyPassword={handleCopyToClipboard}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      onShare={handleShare}
                      showActions={showActions} 
                      page="mypasswords"
                  />
                </Col>
            ))}
        </Row>
      <UpdatePasswordModal
    show={showUpdateModal}
    onHide={() => setShowUpdateModal(false)}
    currentEntry={currentEntry}
    handleChange={handleChange}  
    handleSubmit={handleActualUpdate} 
/>
    <SharePasswordModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        currentEntry={currentEntry}
        email={shareWithEmail}
        setEmail={setShareWithEmail}
        handleShare={handleActualShare} 
    />
  </div>
);
};

export default MyPasswordEntries;