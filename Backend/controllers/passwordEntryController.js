const PasswordEntry = require('../models/PasswordEntry');
const { encrypt, decrypt } = require('./encryption');

exports.createPasswordEntry = async (req, res) => {
    const { url, password, length, alphabet, numerals, symbols } = req.body;

    // Validate input: URL is required
    if (!url) {
        return res.status(400).json({ message: "URL is required." });
    }

    // Handle password generation or use the provided one
    let finalPassword = password;
    if (!finalPassword) {
        // criteria check
        if (!(alphabet || numerals || symbols) || length < 4 || length > 50) {
            return res.status(400).json({ message: "Invalid password generation criteria." });
        }
        finalPassword = generatePassword(length, { alphabet, numerals, symbols });
    }

    const encryptedPassword = encrypt(finalPassword);

    // Create the new password entry
    try {
        const newEntry = new PasswordEntry({
            url,
            password: encryptedPassword, // Save the encrypted password
            user: req.user._id
        });

        await newEntry.save();

        // Respond with the saved entry, excluding the encrypted password for security
        const responseEntry = {
            ...newEntry.toObject(),
            password: undefined 
        };

        res.status(201).json(responseEntry);
    } catch (error) {
        console.error(`Failed to create password entry: ${error}`);
        res.status(500).json({ message: "Failed to create password entry." });
    }
};


exports.getPasswordEntries = async (req, res) => {
    const entries = await PasswordEntry.find({ user: req.user._id });

    const decryptedEntries = entries.map(entry => {
        return {
            ...entry.toObject(),
            password: decrypt(entry.password)
        };
    });

    res.json(decryptedEntries);
};

exports.sharePasswordEntry = async (req, res) => {
    const { id } = req.params; 
    const { userIdToShareWith } = req.body; 

    const passwordEntry = await PasswordEntry.findById(id);
    if (!passwordEntry) {
        return res.status(404).json({ message: 'Password entry not found.' });
    }
    
    // Check if already shared
    if (passwordEntry.sharedWith.includes(userIdToShareWith)) {
        return res.status(400).json({ message: 'Password entry already shared with this user.' });
    }

    // Add the user to the sharedWith array and save
    passwordEntry.sharedWith.push(userIdToShareWith);
    await passwordEntry.save();

    res.status(200).json({ message: 'Password entry shared successfully.' });
};

exports.shareAllPasswordEntries = async (req, res) => {
    const { userIdToShareWith } = req.body; // The ID of the user to share with

    // Ensure the recipient exists and is not the current user
    const recipient = await User.findById(userIdToShareWith);
    if (!recipient || recipient._id.equals(req.user._id)) {
        return res.status(400).json({ message: 'Invalid share recipient.' });
    }

    // Fetch all password entries owned by the current user
    const ownedEntries = await PasswordEntry.find({ user: req.user._id });

    // Iterate over each entry and add a share request
    const sharePromises = ownedEntries.map(entry => {
        if (!entry.shareRequests.some(request => request.user.equals(userIdToShareWith))) {
            entry.shareRequests.push({ user: userIdToShareWith, status: 'pending' });
            return entry.save();
        }
    });

    // Wait for all share requests to be processed
    await Promise.all(sharePromises);

    res.json({ message: `All password entries shared with ${recipient.username}.` });
};

exports.updatePasswordEntry = async (req, res) => {
    const { id } = req.params;
    const { website, username, password } = req.body;

    const encryptedPassword = encrypt(password); 

    const entry = await PasswordEntry.findByIdAndUpdate(id, { website, username, password: encryptedPassword }, { new: true });
    
    if (!entry) {
        return res.status(404).json({ message: "Password entry not found." });
    }

    res.json({
        ...entry.toObject(),
        password: undefined
    });
};

exports.deletePasswordEntry = async (req, res) => {
    const { id } = req.params;
    await PasswordEntry.findByIdAndDelete(id);
    res.status(204).json({ message: 'Password entry deleted' });
};

exports.revokeAccess = async (req, res) => {
    const { id } = req.params; // ID of the password entry
    const { userIdToRevoke } = req.body; // ID of the user to revoke access from

    const passwordEntry = await PasswordEntry.findById(id);
    if (!passwordEntry) {
        return res.status(404).json({ message: 'Password entry not found.' });
    }

    // Remove the user from the sharedWith array
    passwordEntry.sharedWith = passwordEntry.sharedWith.filter(user => !user.equals(userIdToRevoke));
    await passwordEntry.save();

    res.json({ message: 'Access revoked successfully.' });
};

exports.revokeAllAccess = async (req, res) => {
    const { userIdToRevoke } = req.body; // ID of the user to revoke access from all entries

    // Find all entries shared with the specified user and remove them from the sharedWith array
    const updateResult = await PasswordEntry.updateMany(
        { user: req.user._id, sharedWith: userIdToRevoke },
        { $pull: { sharedWith: userIdToRevoke } }
    );

    if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ message: 'No shared entries found for the specified user.' });
    }

    res.json({ message: `Access revoked for all shared entries from user ${userIdToRevoke}.` });
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
    if (options.alphabet) password += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (options.numerals) password += numerals[Math.floor(Math.random() * numerals.length)];
    if (options.symbols) password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest of the password length with random characters from the combined string
    for (let i = password.length; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Shuffle the password to mix the initial characters
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}



