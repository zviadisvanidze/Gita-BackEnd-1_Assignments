const Blog = require('./blog.model');
const User = require('../auth/auth.model');

async function getAllBlogs() {
    return Blog.find().populate('author', 'fullName email').sort({ createdAt: -1 });
}

async function getBlogById(id) {
    return Blog.findById(id).populate('author', 'fullName email');
}

async function createBlog({ title, content, authorId }) {
    const blog = await Blog.create({ title, content, author: authorId });
    await User.findByIdAndUpdate(authorId, { $push: { blogs: blog._id } });
    return blog;
}

async function updateBlog(id, data) {
    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteBlog(id) {
    const blog = await Blog.findByIdAndDelete(id);
    if (blog) {
        await User.findByIdAndUpdate(blog.author, { $pull: { blogs: blog._id } });
    }
    return blog;
}

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
