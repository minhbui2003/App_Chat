const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    firebaseUid: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);