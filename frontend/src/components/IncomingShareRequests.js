import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext'; // Path may vary based on your project structure

const ShareRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user, token } = useAuth(); 

  useEffect(() => {
    const fetchShareRequests = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shares`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch share requests');
        }

        const data = await response.json();
        setRequests(data); // Set the share requests in state
      } catch (error) {
        console.error("Failed to fetch share requests:", error);
      }
    };

    if (user && token) {
      fetchShareRequests();
    }
  }, [user, token]); // Dependency array to re-fetch when these values change

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shares/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to accept share request');
      }

      // Update the UI or reload share requests
      setRequests(requests.map(req => req._id === requestId ? { ...req, status: 'accepted' } : req));
    } catch (error) {
      console.error("Error accepting share request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shares/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject share request');
      }

      // Update the UI or reload share requests
      setRequests(requests.map(req => req._id === requestId ? { ...req, status: 'rejected' } : req));
    } catch (error) {
      console.error("Error rejecting share request:", error);
    }
  };

  return (
    <div>
      <h1>Share Requests</h1>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            From: {request.fromUser.username} ({request.fromUser.email})<br />
            To: {request.toUser.username} ({request.toUser.email})<br />
            Status: <span style={{ color: request.status === 'accepted' ? 'green' : request.status === 'rejected' ? 'red' : 'grey' }}>{request.status}</span><br />
            Entry: {request.passwordEntry.website}<br />
            <Button variant="success" onClick={() => handleAcceptRequest(request._id)} disabled={request.status !== 'pending'}>Accept</Button>
            <Button variant="danger" onClick={() => handleRejectRequest(request._id)} disabled={request.status !== 'pending'}>Reject</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareRequests;
