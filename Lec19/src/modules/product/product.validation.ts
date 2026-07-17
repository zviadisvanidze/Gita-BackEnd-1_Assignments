import Joi from "joi";

// პროდუქტის შექმნის ვალიდაცია
export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "სახელი სავალდებულოა",
    "string.min": "სახელი მინიმუმ 2 სიმბოლო უნდა იყოს",
  }),
  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "აღწერა სავალდებულოა",
    "string.min": "აღწერა მინიმუმ 10 სიმბოლო უნდა იყოს",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "ფასი უნდა იყოს რიცხვი",
    "number.positive": "ფასი დადებითი რიცხვი უნდა იყოს",
  }),
  image: Joi.string().uri().required().messages({
    "string.uri": "ფოტო უნდა იყოს სწორი ლინკი",
    "string.empty": "ფოტოს ლინკი სავალდებულოა",
  }),
  category: Joi.string().trim().min(2).required().messages({
    "string.empty": "კატეგორია სავალდებულოა",
  }),
});

// პროდუქტის განახლების ვალიდაცია (ყველა ველი არასავალდებულოა)
export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(10),
  price: Joi.number().positive(),
  image: Joi.string().uri(),
  category: Joi.string().trim().min(2),
}).min(1);
