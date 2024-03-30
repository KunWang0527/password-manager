const PasswordEntry = require('../models/PasswordEntry');

exports.createPasswordEntry = async (req, res) => {
    const { website, username, password } = req.body;
    const entry = new PasswordEntry({ website, username, password, user: req.user._id });
    await entry.save();
    res.status(201).json(entry);
};

exports.getPasswordEntries = async (req, res) => {
    const entries = await PasswordEntry.find({ user: req.user._id });
    res.json(entries);
};

exports.sharePasswordEntry = async (req, res) => {
    const { id } = req.params; // ID of the password entry owner to share
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
    const entry = await PasswordEntry.findByIdAndUpdate(id, { website, username, password }, { new: true });
    res.json(entry);
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


