import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import UpdatePasswordModal from './UpdatePasswordModal';
import SharePasswordModal from './SharePasswordModal';
import { togglePasswordVisibility, handleCopyToClipboard } from '../utils/passwordUtilities';
import { makeApiRequest } from '../utils/api';


const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { token } = useAuth();
    const [results, setResults] = useState([]);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentEntry, setCurrentEntry] = useState({ id: '', website: '', username: '', password: '' });
    const [shareWithEmail, setShareWithEmail] = useState('');

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                try {
                    const data = await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/search?query=${query}`, 'GET', token);
                    console.log(data);
                    setResults(data || []);  // Ensure data is an array
                } catch (error) {
                    console.error("Failed to fetch search results:", error);
                    setResults([]); // Set to empty array on error
                }
            };
            fetchResults();
        } else {
            setResults([]); // Ensure results are reset/cleared when there is no query
        }
    }, [query, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const updatedData = await makeApiRequest(`${process.env.REACT_APP_BACKEND_URL}/api/passwords/${currentEntry.id}`, 'PUT', token, currentEntry);
            setResults(prev => prev.map(entry => entry._id === updatedData.passwordEntry.id ? updatedData.passwordEntry : entry));
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Failed to update password entry:", error);
        }
    };

    const openUpdateModal = (entry) => {
        setCurrentEntry({ id: entry._id, website: entry.website, username: entry.username, password: '' });
        setShowUpdateModal(true);
    };

    const openShareModal = (id) => {
        setCurrentEntry({ ...currentEntry, id: id });
        setShowShareModal(true);
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
            <h1>Search Results for "{query}"</h1>
            {results.length > 0 ? (
                <ul>
                    {results.map(entry => (
                        <li key={entry._id}>
                            <strong>Website:</strong> {entry.website}<br />
                            {entry.username && <><strong>Username:</strong> {entry.username}<br /></>}
                            <strong>Password:</strong> {visiblePasswords[entry._id] ? entry.password : '****'}
                            <Button onClick={() => setVisiblePasswords(togglePasswordVisibility(visiblePasswords, entry._id))} variant="outline-success">
                                {visiblePasswords[entry._id] ? 'Hide' : 'Show'}
                            </Button>
                            <Button onClick={() => handleCopyToClipboard(visiblePasswords[entry._id] ? entry.password : 'Password hidden')} variant="outline-info">Copy</Button>
                            <Button onClick={() => openUpdateModal(entry)} variant="outline-warning">Update</Button>
                            <Button onClick={() => openShareModal(entry._id)} variant="outline-primary">Share</Button>
                            <br />
                            <small>Last updated: {new Date(entry.updatedAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
            <UpdatePasswordModal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} currentEntry={currentEntry} handleChange={handleChange} handleSubmit={handleUpdate} />
            <SharePasswordModal show={showShareModal} onHide={() => setShowShareModal(false)} email={shareWithEmail} setEmail={setShareWithEmail} handleShare={handleShare} />
        </div>
    );
};

export default SearchPage;
