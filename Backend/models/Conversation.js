const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    type: { type: String, enum: ['single', 'group'], required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    name: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', conversationSchema);