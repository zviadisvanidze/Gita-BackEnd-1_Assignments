import Joi from "joi";


export const createUserSchema = Joi.object({
  username: Joi.string().trim().min(2).max(30).required().messages({
    "string.empty": "სახელი სავალდებულოა",
    "string.min": "სახელი მინიმუმ 2 სიმბოლო უნდა იყოს",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "ელფოსტა არასწორია",
    "string.empty": "ელფოსტა სავალდებულოა",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს",
    "string.empty": "პაროლი სავალდებულოა",
  }),
});


export const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(2).max(30),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6),
  score: Joi.number().min(0),
}).min(1);
