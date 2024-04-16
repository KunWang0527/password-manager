import React, { useEffect, useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { makeApiRequest } from '../utils/api';

const RequestsFromMe = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/shares/my-requests`, 'GET', token);
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch share requests:', error);
        }
    };

    const handleAction = async (action) => {
        if (!currentRequest) return;
    
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/shares/${currentRequest._id}/${action}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update share request:', errorData);
                alert(`Failed to update share request: ${errorData.message}`);
                setShowModal(false);
                return;
            }
    
            const data = await response.json(); 
            console.log('Update successful:', data);
            fetchRequests(); 
            setShowModal(false);
        } catch (error) {
            console.error('Failed to update share request:', error);
            alert('Failed to update share request');
        }
    };

    const openModal = (request) => {
        setCurrentRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h3>My Sent Share Requests</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>To User</th>
                        <th>Url</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request._id}>
                            <td>{request.toUser.username}</td>
                            <td>{request.passwordEntry.website}</td>
                            <td>{request.status}</td>
                            <td>
                                <Button variant="warning" size='sm' onClick={() => openModal(request)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Share Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Would you like to revoke or resend the share request?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleAction('revoked')}>Revoke</Button>
                    <Button variant="primary" onClick={() => handleAction('pending')}>Resend</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RequestsFromMe;
