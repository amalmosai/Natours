import Joi from 'joi';

// Common validation messages
const validationMessages = {
  string: {
    min: 'must be at least 10 characters',
    max: 'must be at most 40 characters',
  },
  number: {
    positive: 'must be a positive number',
  },
  any: {
    required: 'is required',
    only: 'must be one of: easy, medium, or difficult',
  },
};

// Common field validations
const nameValidation = Joi.string()
  .min(10)
  .max(40)
  .required()
  .messages(validationMessages.string);

const durationValidation = Joi.number()
  .positive()
  .required()
  .messages(validationMessages.number);

const maxGroupSizeValidation = Joi.number()
  .positive()
  .required()
  .messages(validationMessages.number);

const difficultyValidation = Joi.string()
  .valid('easy', 'medium', 'difficult')
  .required()
  .messages(validationMessages.any);

const priceValidation = Joi.number()
  .positive()
  .required()
  .messages(validationMessages.number);

const priceDiscountValidation = Joi.number()
  .optional()
  .less(Joi.ref('price'))
  .messages({
    'number.less': 'Discount price must be less than regular price',
  });
const descriptionValidation = Joi.string()
  .optional()
  .messages(validationMessages.string);

const summaryValidation = Joi.string()
  .min(10)
  .required()
  .messages(validationMessages.string);

const imageCoverValidation = Joi.string()
  .required()
  .messages(validationMessages.any);

const imagesValidation = Joi.array()
  .required()
  .messages(validationMessages.any);

const startDatesValidation = Joi.array()
  .items(Joi.date())
  .required()
  .messages(validationMessages.any);

const ratingsAverageValidation = Joi.number()
  .required()
  .default(4.5)
  .messages(validationMessages.number);

const ratingsQuantityValidation = Joi.number()
  .required()
  .default(0)
  .messages(validationMessages.number);

const secretTourValidation = Joi.boolean().optional().default(false);

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
