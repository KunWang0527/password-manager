import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdatePasswordModal = ({ show, onHide, currentEntry, handleChange, handleSubmit }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Update Password Entry</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="website">
          <Form.Label>Website URL</Form.Label>
          <Form.Control type="text" name="website" value={currentEntry.website} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="username">
          <Form.Label>Username (optional)</Form.Label>
          <Form.Control type="text" name="username" value={currentEntry.username} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>New Password (leave blank to keep current)</Form.Label>
          <Form.Control type="password" name="password" value={currentEntry.password} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Update Entry</Button>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default UpdatePasswordModal;
