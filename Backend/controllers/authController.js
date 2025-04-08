const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const admin = require('../config/firebase');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'minhbui88888888@gmail.com',
        pass: 'your-app-password',
    },
});

exports.registerEmail = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Xác minh tài khoản',
        text: `Mã OTP của bạn là: ${otp}`,
    });
    global.tempOtp = { email, otp, expires: Date.now() + 10 * 60 * 1000 };
    res.json({ message: 'OTP sent', email });
};

exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    if (
        global.tempOtp.email === email &&
        global.tempOtp.otp === otp &&
        global.tempOtp.expires > Date.now()
    ) {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, username: email.split('@')[0] });
            await user.save();
        }
        const token = jwt.sign({ id: user._id }, 'JWT_SECRET', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ error: 'Invalid or expired OTP' });
    }
};

exports.registerPhone = async (req, res) => {
    const { phone, firebaseToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    let user = await User.findOne({ phone });
    if (!user) {
        user = new User({ phone, firebaseUid: decodedToken.uid, username: phone });
        await user.save();
    }
    const token = jwt.sign({ id: user._id }, 'JWT_SECRET', { expiresIn: '1h' });
    res.json({ token });
};

exports.googleLogin = async (req, res) => {
    const { googleToken } = req.body;
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');
    const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: 'YOUR_GOOGLE_CLIENT_ID',
    });
    const { sub: googleId, email } = ticket.getPayload();
    let user = await User.findOne({ googleId });
    if (!user) {
        user = new User({ email, googleId, username: email.split('@')[0] });
        await user.save();
    }
    const token = jwt.sign({ id: user._id }, 'JWT_SECRET', { expiresIn: '1h' });
    res.json({ token });
};