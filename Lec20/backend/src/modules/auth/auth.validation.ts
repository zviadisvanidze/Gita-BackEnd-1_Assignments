import Joi from "joi";


export const registerSchema = Joi.object({
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


export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "ელფოსტა არასწორია",
    "string.empty": "ელფოსტა სავალდებულოა",
  }),
  password: Joi.string().required().messages({
    "string.empty": "პაროლი სავალდებულოა",
  }),
});
