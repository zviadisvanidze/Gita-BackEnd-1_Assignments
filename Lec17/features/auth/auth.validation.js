const { z } = require('zod');

const signupSchema = z.object({
    fullName: z.string().trim().min(2, 'სრული სახელი მინიმუმ 2 სიმბოლო უნდა იყოს'),
    email: z.string().trim().toLowerCase().email('არასწორი ელფოსტის ფორმატი'),
    password: z.string().min(6, 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს'),
    birthDate: z.coerce.date('დაბადების თარიღი სავალდებულოა'),
});

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('არასწორი ელფოსტის ფორმატი'),
    password: z.string().min(1, 'პაროლი სავალდებულოა'),
});

module.exports = { signupSchema, loginSchema };
