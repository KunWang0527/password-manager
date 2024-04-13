const express = require('express');
const router = express.Router();
const passwordEntriesController = require('../controllers/passwordEntryController');
const { authenticateToken, isEntryOwner } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

// Routes for creating and getting password entries
router.post('/', authenticateToken, catchAsync(passwordEntriesController.createPasswordEntry));
router.get('/', authenticateToken, catchAsync(passwordEntriesController.getPasswordEntries));

// Route for updating a specific password entry
router.put('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.updatePasswordEntry));

// Route for deleting a specific password entry
router.delete('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.deletePasswordEntry));

router.get('/shared-with-me', authenticateToken, passwordEntriesController.getSharedPasswords);

router.get('/search', authenticateToken, passwordEntriesController.searchPasswordEntries);


module.exports = router;