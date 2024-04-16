const express = require('express');
const router = express.Router();
const passwordEntriesController = require('../controllers/passwordEntryController');
const { authenticateToken, isEntryOwner } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.post('/', authenticateToken, catchAsync(passwordEntriesController.createPasswordEntry));
router.get('/', authenticateToken, catchAsync(passwordEntriesController.getPasswordEntries));
router.get('/shared-with-me', authenticateToken, passwordEntriesController.getSharedPasswords);
router.get('/search', authenticateToken, passwordEntriesController.searchPasswordEntries);

router.put('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.updatePasswordEntry));

router.delete('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.deletePasswordEntry));




module.exports = router;