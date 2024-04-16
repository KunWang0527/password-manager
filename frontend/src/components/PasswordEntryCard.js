import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../assets/PasswordEntryCard.css';

const PasswordEntryCard = ({
    entry,
    isVisible,
    onToggleVisibility,
    onCopyPassword,
    onUpdate,  
    onDelete,
    onShare,
    showActions=['show','copy','share','update','delete'],
    page,
    sharedBy
}) => {
    const extractDomain = (url) => {
        try {
            if (!url.match(/^https?:\/\//)) {
                url = 'http://' + url;
            }
            const domain = new URL(url).hostname;
            return domain.replace(/^www\./, '');
        } catch (error) {
            console.error("Invalid URL", error);
            return null;
        }
    };

    const cardClassName = `mb-6 card-custom ${page === 'mypasswords' ? 'mypasswords-style' : ''}`;


    const imageUrl = `https://logo.clearbit.com/${extractDomain(entry.website)}`;
    return (
        <Card className={cardClassName}>
            <Card.Img
                variant="top"
                src={imageUrl}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://assets.ccbp.in/frontend/react-js/password-manager-logo-img.png';
                }}
                className="card-img-top"
            />
                <Card.Body>
                    <Card.Title>                
                        <strong>Website:</strong> {entry.website}<br />
                    </Card.Title>
                    <Card.Text>
                        <strong>Username:</strong> {entry.username || "Not provided"}
                    </Card.Text>
                    <Card.Text>
                        <strong>Password:</strong> {isVisible ? entry.password : '****'}
                    </Card.Text>
                    {sharedBy && <Card.Text className="shared-by"><strong>Shared by:</strong> {sharedBy}</Card.Text>}
                    {showActions.includes('show') && (
                    <div className="buttons">
                        <button className="d-1" onClick={() => onToggleVisibility(entry._id)}>
                            {isVisible ? 'Hide' : 'Show'}
                        </button>
                        {showActions.includes('copy') && (
                            <button className="d-1" onClick={() => onCopyPassword(entry.password)}>
                                Copy
                            </button>
                        )}
                    </div>
                )}
                <div className="row mt-2 dark-theme-buttons">
                    {showActions.includes('update') && (
                        <div className="col">
                        <Button onClick={() => onUpdate(entry)} variant="primary" className="w-100">
                            Update
                        </Button>
                        </div>
                    )}
                    {showActions.includes('delete') && (
                        <div className="col">
                        <Button onClick={() => onDelete(entry._id)} variant="danger" className="w-100">
                            Delete
                        </Button>
                        </div>
                    )}
                    {showActions.includes('share') && (
                        <div className="col">
                        <Button onClick={() => onShare(entry)} variant="info" className="w-100">
                            Share
                        </Button>
                        </div>
                    )}
                </div>
            </Card.Body>
            <Card.Footer>
                <small>Last updated: {new Date(entry.updatedAt).toLocaleDateString()}</small>
            </Card.Footer>
        </Card>
    );
};

export default PasswordEntryCard;
