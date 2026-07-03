const { z } = require('zod');

const createBlogSchema = z.object({
    title: z.string().trim().min(2, 'სათაური მინიმუმ 2 სიმბოლო უნდა იყოს'),
    content: z.string().trim().min(10, 'კონტენტი მინიმუმ 10 სიმბოლო უნდა იყოს'),
});

const updateBlogSchema = createBlogSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'განსაახლებელი ველი სავალდებულოა' }
);

module.exports = { createBlogSchema, updateBlogSchema };
