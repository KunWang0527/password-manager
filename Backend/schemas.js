const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// Extend BaseJoi with the extension
const Joi = BaseJoi.extend(extension);

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().escapeHTML(),
    email: Joi.string().email({ tlds: { allow: false } }).required().escapeHTML(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

const passwordEntrySchema = Joi.object({
    website: Joi.string().required().escapeHTML(),
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required() 
});

module.exports = { userSchema, passwordEntrySchema };
