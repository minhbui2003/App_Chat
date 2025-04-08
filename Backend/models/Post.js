const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);