import Joi, { required } from 'joi';

// Common validation messages
const validationMessages = {
  string: {
    min: 'A tour name must have more or equal then 10 characters',
    max: 'A tour name must have less or equal then 40 characters',
    required: 'A tour must have a name',
  },
  number: {
    positive: 'must be a positive number',
    min: 'Rating must be above 1.0',
    max: 'Rating must be below 5.0',
    required: {
      duration: 'A tour must have a duration',
      groupSize: 'A tour must have a group size',
      price: 'A tour must have a price',
    },
  },
  difficulty: {
    enum: 'Difficulty must be one of: easy, medium, or difficult',
    required: 'A tour must have a difficulty',
  },
  discount: {
    less: ' Discount price must be less than regular price',
  },
  summary: {
    required: 'A tour must have a summary',
  },
  image: {
    required: 'A tour must have a cover image',
  },
};

// Common field validations
const nameValidation = Joi.string().min(10).max(40).trim().required().messages({
  'string.base': 'Name must be a string',
  'string.min': validationMessages.string.min,
  'string.max': validationMessages.string.max,
  'string.empty': validationMessages.string.required,
  'any.required': validationMessages.string.required,
});

const durationValidation = Joi.number().positive().required().messages({
  'number.base': validationMessages.number.required.duration,
  'number.positive': validationMessages.number.positive,
  'any.required': validationMessages.number.required.duration,
});

const maxGroupSizeValidation = Joi.number().positive().required().messages({
  'number.base': validationMessages.number.required.groupSize,
  'number.positive': validationMessages.number.positive,
  'any.required': validationMessages.number.required.groupSize,
});

const difficultyValidation = Joi.string()
  .valid('easy', 'medium', 'difficult')
  .required()
  .messages({
    'string.base': validationMessages.difficulty.required,
    'any.only': validationMessages.difficulty.enum,
    'any.required': validationMessages.difficulty.required,
  });

const priceValidation = Joi.number().positive().required().messages({
  'number.base': validationMessages.number.required.price,
  'number.positive': validationMessages.number.positive,
  'any.required': validationMessages.number.required.price,
});

const priceDiscountValidation = Joi.number()
  .optional()
  .less(Joi.ref('price'))
  .messages({
    'number.less': validationMessages.discount.less,
    'number.base': 'Discount must be a number',
  });
const descriptionValidation = Joi.string().trim().optional().messages({
  'string.base': 'Description must be a string',
});

const summaryValidation = Joi.string().trim().required().messages({
  'string.base': 'summary must be string',
  'string.empty': validationMessages.summary.required,
  'any.required': validationMessages.summary.required,
});

const imageCoverValidation = Joi.string().required().messages({
  'string.base': 'Cover image must be a string',
  'string.empty': validationMessages.image.required,
  'any.required': validationMessages.image.required,
});

const imagesValidation = Joi.array().items(Joi.string()).optional();

const startDatesValidation = Joi.array().items(Joi.date()).optional();

const ratingsAverageValidation = Joi.number()
  .min(1)
  .max(5)
  .default(4.5)
  .messages({
    'number.min': validationMessages.number.min,
    'number.max': validationMessages.number.max,
  });

const ratingsQuantityValidation = Joi.number().default(0);
const secretTourValidation = Joi.boolean().optional().default(false).messages({
  'boolean.base': 'Secret tour must be a boolean',
});

// Create Tour Schema
const createTourSchema = Joi.object({
  name: nameValidation,
  duration: durationValidation,
  maxGroupSize: maxGroupSizeValidation,
  difficulty: difficultyValidation,
  price: priceValidation,
  priceDiscount: priceDiscountValidation,
  summary: summaryValidation,
  images: imagesValidation,
  imageCover: imageCoverValidation,
  startDates: startDatesValidation,
  secretTour: secretTourValidation,
  ratingsAverage: ratingsAverageValidation,
  ratingsQuantity: ratingsQuantityValidation,
  description: descriptionValidation,
});

// Update Tour Schema
const updateTourSchema = Joi.object({
  name: nameValidation.optional(),
  duration: durationValidation.optional(),
  maxGroupSize: maxGroupSizeValidation.optional(),
  difficulty: difficultyValidation.optional(),
  price: priceValidation.optional(),
  priceDiscount: priceDiscountValidation.optional(),
  summary: summaryValidation.optional(),
  images: imagesValidation.optional(),
  imageCover: imageCoverValidation.optional(),
  startDates: startDatesValidation.optional(),
  secretTour: secretTourValidation.optional(),
  ratingsAverage: ratingsAverageValidation.optional(),
  ratingsQuantity: ratingsQuantityValidation.optional(),
  description: descriptionValidation.optional(),
}).min(1);

export { createTourSchema, updateTourSchema };
