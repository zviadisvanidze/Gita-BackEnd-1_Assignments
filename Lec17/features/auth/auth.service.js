const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const Blog = require('../blogs/blog.model');
const cloudinary = require('../../config/cloudinary');

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

function uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        stream.end(buffer);
    });
}

async function uploadProfilePicture(userId, file) {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('მომხმარებელი ვერ მოიძებნა');
        error.status = 404;
        throw error;
    }

    if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
    }

    const result = await uploadToCloudinary(file.buffer, {
        folder: 'lec17/profile-pictures',
        public_id: `user_${userId}`,
        overwrite: true,
        resource_type: 'image',
    });

    user.profilePicture = { url: result.secure_url, publicId: result.public_id };
    await user.save();

    return user;
}

async function deleteProfilePicture(userId) {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('მომხმარებელი ვერ მოიძებნა');
        error.status = 404;
        throw error;
    }

    if (!user.profilePicture?.publicId) {
        const error = new Error('პროფილის სურათი ატვირთული არ არის');
        error.status = 400;
        throw error;
    }

    await cloudinary.uploader.destroy(user.profilePicture.publicId);

    user.profilePicture = { url: null, publicId: null };
    await user.save();

    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    deleteUser,
    uploadProfilePicture,
    deleteProfilePicture,
};
