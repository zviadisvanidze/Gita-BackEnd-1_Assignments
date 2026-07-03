const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        profilePicture: {
            url: { type: String, default: null },
            publicId: { type: String, default: null },
        },
        blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Blog',
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
