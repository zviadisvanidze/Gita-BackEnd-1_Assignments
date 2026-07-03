const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const Blog = require('../blogs/blog.model');

const TOKEN_EXPIRY = '7d';

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

async function registerUser({ fullName, email, password, birthDate }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('ეს ელფოსტა უკვე რეგისტრირებულია');
        error.status = 400;
        throw error;
    }

    const user = await User.create({ fullName, email, password, birthDate });
    const token = generateToken(user._id);
    return { user, token };
}

async function loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('არასწორი ელფოსტა ან პაროლი');
        error.status = 400;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('არასწორი ელფოსტა ან პაროლი');
        error.status = 400;
        throw error;
    }

    const token = generateToken(user._id);
    return { user, token };
}

async function getUserById(id) {
    return User.findById(id).select('-password');
}

async function deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) return null;

    await Blog.deleteMany({ author: id });
    return user;
}

module.exports = { registerUser, loginUser, getUserById, deleteUser };
