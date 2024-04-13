import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SharePasswordModal = ({ show, onHide, email, setEmail, handleShare }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Share Password Entry</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="email">
          <Form.Label>Email to share with:</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Close</Button>
      <Button variant="primary" onClick={handleShare}>Share</Button>
    </Modal.Footer>
  </Modal>
);

export default SharePasswordModal;
