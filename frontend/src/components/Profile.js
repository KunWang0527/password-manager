import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, token, setUser} = useAuth();  
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    throw new Error('Failed to fetch user details.');
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token, setUser]);


    const handleUsernameUpdate = async () => {
        if (!newUsername) {
            alert("Username cannot be empty.");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername })
            });
            if (!response.ok) {
                throw new Error('Failed to update username');
            }
            alert('Username updated successfully');
            setShowUsernameModal(false);
        } catch (error) {
            console.error("Failed to update username:", error);
            alert(error.message);
        }
    };

    const handlePasswordUpdate = async () => {
        const payload = {
          newPassword: newPassword, 
        };
      
        try {
          const response = await fetch('http://localhost:5000/api/users/profile/password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify(payload)
          });
      
          if (!response.ok) {
            throw new Error('Failed to update password');
          }
          const data = await response.json();
          alert('Password updated successfully:', data);
        } catch (error) {
          console.error('Error updating password:', error);
        }
      };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

            <Button variant="outline-warning" onClick={() => setShowUsernameModal(true)}>
                Change Username
            </Button>
            <br></br><br></br><br></br>
            <Button variant="outline-danger" onClick={() => setShowPasswordModal(true)}>
                Change Password
            </Button>
            <Modal show={showUsernameModal} onHide={() => setShowUsernameModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter new username"
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUsernameUpdate}>
                            Update Username
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handlePasswordUpdate}>
                            Update Password
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;
