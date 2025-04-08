const User = require('../models/User');

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, avatar, bio } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { username, avatar, bio },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!user || !friend) return res.status(404).json({ error: 'User not found' });
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }
        if (!friend.friends.includes(userId)) {
            friend.friends.push(userId);
            await friend.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};