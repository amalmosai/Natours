import express, { NextFunction, Request, Response } from 'express';
import { TourController } from '../controllers/tour.controller';
import { TourService } from '../models/dao/tour.dao';

const router = express.Router();

const tourService = new TourService();
const tourController = new TourController(tourService);
// this middleware local for this route
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours.bind(tourController),
    tourController.getAllTours.bind(tourController),
  );

router
  .route('/tour-stats')
  .get(tourController.getTourStats.bind(tourController));

router
  .route('/')
  .get(tourController.getAllTours.bind(tourController))
  .post(tourController.createTour.bind(tourController));
router
  .route('/:id')
  .get(tourController.getTourById.bind(tourController))
  .patch(tourController.updateTourById.bind(tourController))
  .delete(tourController.deleteTourById.bind(tourController));

export default router;
