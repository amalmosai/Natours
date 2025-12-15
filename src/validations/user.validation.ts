import Joi from 'joi';

/**
 * Common validation messages
 */
const validationMessages = {
  string: {
    min: 'Name must be at least 2 characters',
    max: 'Name cannot exceed 50 characters',
    required: {
      name: 'A user must have a name',
      email: 'A user must have an email',
      password: 'A user must have a password',
    },
    email: 'Please provide a valid email address',
  },
  password: {
    complexity:
      'Password must contain at least one lowercase, uppercase, number, and special character',
    min: 'Password must be at least 8 characters',
    match: 'Passwords do not match',
  },
  role: {
    enum: 'Role must be one of: USER, GUIDE, LEAD_GUIDE, ADMIN',
    required: 'A user must have a role',
  },
  boolean: {
    active: 'Active status must be a boolean',
  },
  photo: {
    uri: 'Photo must be a valid URI',
  },
};

/**
 * Common field validations
 */
const nameValidation = Joi.string().min(2).max(50).trim().required().messages({
  'string.base': 'Name must be a string',
  'string.min': validationMessages.string.min,
  'string.max': validationMessages.string.max,
  'string.empty': validationMessages.string.required.name,
  'any.required': validationMessages.string.required.name,
});

const emailValidation = Joi.string().email().required().messages({
  'string.base': 'Email must be a string',
  'string.email': validationMessages.string.email,
  'string.empty': validationMessages.string.required.email,
  'any.required': validationMessages.string.required.email,
});

const passwordValidation = Joi.string()
  .min(8)
  .required()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
  .messages({
    'string.min': validationMessages.password.min,
    'string.pattern.base': validationMessages.password.complexity,
    'string.empty': validationMessages.string.required.password,
    'any.required': validationMessages.string.required.password,
  });

const passwordConfirmValidation = Joi.string()
  .valid(Joi.ref('password'))
  .required()
  .messages({
    'any.only': validationMessages.password.match,
    'any.required': 'Please confirm your password',
  });

const roleValidation = Joi.string()
  .valid('USER', 'GUIDE', 'LEAD_GUIDE', 'ADMIN')
  .default('USER')
  .messages({
    'string.base': validationMessages.role.required,
    'any.only': validationMessages.role.enum,
  });

const photoValidation = Joi.string().uri().optional().messages({
  'string.uri': validationMessages.photo.uri,
});

const activeValidation = Joi.boolean().default(true).messages({
  'boolean.base': validationMessages.boolean.active,
});

/**
 * Create User Schema
 */
const createUserSchema = Joi.object({
  name: nameValidation,
  email: emailValidation,
  photo: photoValidation,
  role: roleValidation,
  password: passwordValidation,
  passwordConfirm: passwordConfirmValidation,
  active: activeValidation,
});

/**
 * Update User Schema
 */
const updateUserSchema = Joi.object({
  name: nameValidation.optional(),
  photo: photoValidation.optional(),
  email: emailValidation.optional(),
  password: Joi.forbidden().messages({
    'any.unknown':
      'Password cannot be updated here. Please use the password reset feature.',
    'any.forbidden':
      'Password cannot be updated here. Please use the password reset feature.',
  }),
  role: Joi.forbidden(),
  active: Joi.forbidden(),
}).min(1);

/**
 * Login Schema
 */
const loginSchema = Joi.object({
  email: emailValidation,
  password: Joi.string().required().messages({
    'string.empty': 'Please provide your password',
    'any.required': 'Please provide your password',
  }),
});

/**
 * Change Password Schema
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Please provide your current password',
    'any.required': 'Please provide your current password',
  }),
  newPassword: passwordValidation,
  newpasswordConfirm: passwordConfirmValidation,
});

/**
 * Forgot Password Schema
 */
const forgotPasswordSchema = Joi.object({
  email: emailValidation,
});

/**
 *  Reset Password Schema
 */
const resetPasswordSchema = Joi.object({
  newPassword: passwordValidation,
  passwordConfirm: passwordConfirmValidation,
});

export {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
