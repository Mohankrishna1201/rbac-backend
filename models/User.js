const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }, // GridFS image reference
    bio: { type: String },
    role: { type: String, required: true, default: 'user' }, // e.g., 'admin', 'user'
    permissions: [{ type: String }], // e.g., ['READ_POSTS', 'WRITE_POSTS']
    isDisabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
