import { Request, Response, NextFunction } from 'express';
import { TourService } from '../models/dao/tour.dao';
import { CreateTourDto, UpdateTourDto } from '../models/dto/tour.dto';
import {
  createTourSchema,
  updateTourSchema,
} from '../validations/tour.validations';
import { asyncWrapper } from '../utils/asynHandler';
import { createCustomError } from '../utils/apiError';

export class TourController {
  // private tourService: TourService;

  // constructor(tourService: TourService) {
  //   this.tourService = tourService;
  // }

  public constructor(private readonly tourService: TourService) {} // dependency injection

  /**
   * Creates a new tour.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public createTour = asyncWrapper(async (req: Request, res: Response) => {
    const { error } = createTourSchema.validate(req.body);
    if (error) throw createCustomError(error.details[0].message, 400);

    const createTourDto = new CreateTourDto(req.body);
    const newTour = await this.tourService.createTour(createTourDto);
    res.status(201).json(newTour);
  });
  /**
   * Updates an existing tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public updateTourById = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { error } = updateTourSchema.validate(req.body);
      if (error) throw createCustomError(error.details[0].message, 400);

      const updateTourDto = new UpdateTourDto(req.body);
      const updatedTour = await this.tourService.updateTourById(
        id,
        updateTourDto,
      );

      if (!updatedTour) {
        return next(createCustomError('No tour found with that ID', 404));
      }
      res.status(200).json(updatedTour);
    },
  );

  /**
   * Retrieves a tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public getTourById = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const tour = await this.tourService.getTourById(id);
      if (!tour) {
        return next(createCustomError('No tour found with that ID', 404));
      }
      res.status(200).json(tour);
    },
  );

  /**
   * Retrieves all tours.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public getAllTours = asyncWrapper(async (req: Request, res: Response) => {
    const tours = await this.tourService.getAllTours(req.query);
    res.status(200).json(tours);
  });

  /**
   * Deletes a tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public deleteTourById = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const deletedTour = await this.tourService.deleteTourById(id);
      if (!deletedTour) {
        return next(createCustomError('No tour found with that ID', 404));
      }

      res.status(200).json(deletedTour);
    },
  );

  /**
   * Middleware that modifies the query parameters to fetch top-rated tours.
   * - Limits results to 5 tours
   * - Sorts by ratings (descending) and price (ascending)
   * - Selects only specific fields for efficiency
   * @param {Request} req - Express request object (query params will be modified)
   * @param {Response} res - Express response object (not used here)
   * @param {NextFunction} next - Express next function to pass control to next middleware
   */
  public aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '5';
    req.query.sort = 'ratingsAverage:desc,price:asc';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

  /**
   * Fetches aggregated tour statistics (average ratings, difficulty stats, etc.)
   * @async
   * @returns {Promise<void>}
   */
  public getTourStats = asyncWrapper(async (req: Request, res: Response) => {
    const stats = await this.tourService.getTourStats();
    res.status(200).json({ status: 'success', data: { stats } });
  });

  /**
   * Gets monthly tour plan for a specific year (tours grouped by month)
   * @async
   * @param {number} year - Target year from URL params (/:year)
   * @returns {Promise<void>}
   */
  public getMonthlyPlan = asyncWrapper(async (req: Request, res: Response) => {
    const year = parseInt(req.params.year);
    const plan = await this.tourService.getMonthlyPlan(year);
    res.status(200).json({ status: 'success', data: { plan } });
  });
}
