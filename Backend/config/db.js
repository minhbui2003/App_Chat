const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect('mongodb://localhost/zalo_app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};