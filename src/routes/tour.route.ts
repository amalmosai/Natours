import express, { NextFunction, Request, Response } from 'express';
import { TourController } from '../controllers/tour.controller';
import { TourService } from '../models/dao/tour.dao';
import { authenticateUser, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

const tourService = new TourService();
const tourController = new TourController(tourService);
// this middleware local for this route
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(
    authenticateUser,
    tourController.aliasTopTours.bind(tourController),
    tourController.getAllTours.bind(tourController),
  );

router
  .route('/tour-stats')
  .get(authenticateUser, tourController.getTourStats.bind(tourController));

router
  .route('/monthly-plan/:year')
  .get(authenticateUser, tourController.getMonthlyPlan.bind(tourController));

router
  .route('/')
  .get(authenticateUser, tourController.getAllTours.bind(tourController))
  .post(authenticateUser, tourController.createTour.bind(tourController));
router
  .route('/:id')
  .get(authenticateUser, tourController.getTourById.bind(tourController))
  .patch(authenticateUser, tourController.updateTourById.bind(tourController))
  .delete(
    authenticateUser,
    authorizeRoles('LEAD_GUIDE', 'ADMIN'),
    tourController.deleteTourById.bind(tourController),
  );

export default router;
