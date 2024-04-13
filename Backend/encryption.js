const crypto = require('crypto');

const originalKey = process.env.ENCRYPTION_KEY;
const key = crypto.createHash('sha256').update(String(originalKey)).digest('base64').substr(0, 32);

function encrypt(text) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        if (textParts.length !== 2) {
            throw new Error("Invalid encrypted text format.");
        }

        let iv = Buffer.from(textParts[0], 'hex');
        let encryptedText = Buffer.from(textParts[1], 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Decryption failed.");
    }
}

module.exports = { encrypt, decrypt };
