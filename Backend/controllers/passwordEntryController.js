const PasswordEntry = require('../models/PasswordEntry');
const ShareRequest = require('../models/ShareRequest');
const { encrypt, decrypt } = require('../encryption');
const crypto = require('crypto');



// Create Password Entry
exports.createPasswordEntry = async (req, res) => {
    const { website, username, password, length, alphabet, numerals, symbols } = req.body;

    // Validate required fields
    if (!website) {
        return res.status(400).json({ message: "Website is required." });
    }

    let finalPassword = password;
    if (!finalPassword) {
        // Password generation criteria check
        if (!(alphabet || numerals || symbols) || length < 4 || length > 50) {
            return res.status(400).json({ message: "Invalid password generation criteria." });
        }
        finalPassword = generatePassword(length, { alphabet, numerals, symbols });
    }

    const encryptedPassword = encrypt(finalPassword);

    try {
        const newEntry = new PasswordEntry({
            website, 
            username: username || "",
            password: encryptedPassword,
            user: req.user.userId
        });

        await newEntry.save();
        res.status(201).json({
            message: 'Password entry created successfully.',
            passwordEntry: {
                id: newEntry._id,
                website: newEntry.website,
                username: newEntry.username
            }
        });
    } catch (error) {
        console.error(`Failed to create password entry: ${error}`);
        res.status(500).json({ message: "Failed to create password entry.", error: error.message });
    }
};

// Retrieve Password Entries
exports.getPasswordEntries = async (req, res) => {
    try {
        const entries = await PasswordEntry.find({ user: req.user.userId });
        const decryptedEntries = entries.map(entry => ({
            ...entry.toObject(),
            password: decrypt(entry.password)
        }));

        res.json({ passwords: decryptedEntries });
    } catch (error) {
        console.error(`Failed to retrieve password entries: ${error}`);
        res.status(500).json({ message: "Failed to retrieve password entries.", error: error.message });
    }
};

// Update Password Entry
exports.updatePasswordEntry = async (req, res) => {
    const { id } = req.params;
    const { website, username, password } = req.body;

    const encryptedPassword = encrypt(password);

    try {
        const updatedEntry = await PasswordEntry.findByIdAndUpdate(
            id, 
            { website, username, password: encryptedPassword }, 
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: "Password entry not found." });
        }

        res.json({
            message: 'Password entry updated successfully.',
            passwordEntry: {
                id: updatedEntry._id,
                website: updatedEntry.website,
                username: updatedEntry.username
            }
        });
    } catch (error) {
        console.error(`Failed to update password entry: ${error}`);
        res.status(500).json({ message: "Failed to update password entry.", error: error.message });
    }
};

// Delete Password Entry
exports.deletePasswordEntry = async (req, res) => {
    const { id } = req.params;

    try {
        await PasswordEntry.findByIdAndDelete(id);
        res.status(204).json({ message: 'Password entry deleted successfully.' });
    } catch (error) {
        console.error(`Failed to delete password entry: ${error}`);
        res.status(500).json({ message: "Failed to delete password entry.", error: error.message });
    }
};

exports.getSharedPasswords = async (req, res) => {
    try {
        const sharedEntries = await ShareRequest.find({
            toUser: req.user.userId,
            status: 'accepted'
        })
        .populate({
            path: 'passwordEntry',
            populate: {
                path: 'user',
                select: 'username' // Only fetch the username of the user
            }
        });

        const entriesWithDecryptedPasswords = sharedEntries.map(request => ({
            ...request.passwordEntry.toObject(),
            password: decrypt(request.passwordEntry.password),
            sharedBy: request.passwordEntry.user.username 
        }));

        res.json({ sharedPasswords: entriesWithDecryptedPasswords });
    } catch (error) {
        console.error('Failed to fetch shared passwords:', error);
        res.status(500).json({ message: "Failed to fetch shared passwords.", error: error.message });
    }
};




function generatePassword(length, options) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numerals = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?';

    let characters = '';
    let password = '';

    if (options.alphabet) characters += alphabet;
    if (options.numerals) characters += numerals;
    if (options.symbols) characters += symbols;

    // Ensure each selected type is represented at least once
    if (options.alphabet) password += alphabet.charAt(crypto.randomInt(0, alphabet.length));
    if (options.numerals) password += numerals.charAt(crypto.randomInt(0, numerals.length));
    if (options.symbols) password += symbols.charAt(crypto.randomInt(0, symbols.length));

    // Fill the rest of the password length with random characters from the combined string
    while (password.length < length) {
        const randomIndex = crypto.randomInt(0, characters.length);
        password += characters.charAt(randomIndex);
    }

    // Shuffling not necessary as characters are already chosen at random

    return password;
}


