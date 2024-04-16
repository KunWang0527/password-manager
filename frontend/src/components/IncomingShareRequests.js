import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext'; 
import RequestsFromMe from './RequestsFromMe';
import '../assets/IncomingShareRequest.css'

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
        setRequests(data); 
      } catch (error) {
        console.error("Failed to fetch share requests:", error);
      }
    };

    if (user && token) {
      fetchShareRequests();
    }
  }, [user, token]); 

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

      setRequests(requests.map(req => req._id === requestId ? { ...req, status: 'rejected' } : req));
    } catch (error) {
      console.error("Error rejecting share request:", error);
    }
  };

  return (
    <div>
      <h2>Share Requests:</h2>
      <ul className="request-list">
            {requests.map((request) => (
                <li key={request._id} className="request-item">
                    <div className="request-detail">From: {request.fromUser.username} ({request.fromUser.email})</div>
                    <div className="request-detail">To: {request.toUser.username} ({request.toUser.email})</div>
                    <div className="request-detail">
                        Status: <span style={{ color: request.status === 'accepted' ? 'green' : request.status === 'rejected' ? 'red' : 'grey' }}>{request.status}</span>
                    </div>
                    <div className="request-detail">Entry: {request.passwordEntry.website}</div>
                    <div className="request-buttons">
                        <Button className="button button-success" onClick={() => handleAcceptRequest(request._id)} disabled={request.status !== 'pending'}>Accept</Button>
                        <Button className="button button-danger" onClick={() => handleRejectRequest(request._id)} disabled={request.status !== 'pending'}>Reject</Button>
                    </div>
                </li>
            ))}
        </ul>
      <RequestsFromMe />
    </div>
    
  );
};

export default ShareRequests;
