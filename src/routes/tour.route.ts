import express, { NextFunction, Request, Response } from 'express';
import * as tourController from '../controllers/tour.controller';

const router = express.Router();

// this middleware local for this route
// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
