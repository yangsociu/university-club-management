const Joi = require('joi');

const validateUser = (data) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Full name is required',
        'string.min': 'Full name must be at least 3 characters long',
        'string.max': 'Full name must not exceed 50 characters',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
      }),
    phoneNumber: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
      }),
    studentId: Joi.string().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required',
      }),
  });

  return schema.validate(data);
};

const validateClub = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Club name is required',
        'string.min': 'Club name must be at least 3 characters long',
      }),
    description: Joi.string()
      .min(10)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters long',
      }),
    category: Joi.string()
      .valid('sports', 'arts', 'academic', 'social', 'technology', 'culture', 'other')
      .required()
      .messages({
        'string.empty': 'Category is required',
        'any.only': 'Invalid category',
      }),
    location: Joi.string().optional(),
    meetingSchedule: Joi.string().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUser,
  validateLogin,
  validateClub,
};
