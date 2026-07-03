const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const authRouter = require('./features/auth/auth.routes');
const blogsRouter = require('./features/blogs/blog.routes');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/blogs', blogsRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
    });
});
