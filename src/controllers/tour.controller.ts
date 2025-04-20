import { Request, Response, NextFunction } from 'express';
import { TourService } from '../models/dao/tour.dao';
import { CreateTourDto, UpdateTourDto } from '../models/dto/tour.dto';
import {
  createTourSchema,
  updateTourSchema,
} from '../validations/tour.validations';

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
  public async createTour(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error } = createTourSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      // Create tour
      const createTourDto = new CreateTourDto(req.body);
      const newTour = await this.tourService.createTour(createTourDto);
      res.status(201).json(newTour);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'Error creating tour', error: err.message });
    }
  }

  /**
   * Updates an existing tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public async updateTourById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      // Validate request body
      const { error } = updateTourSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      // Update tour
      const updateTourDto = new UpdateTourDto(req.body);
      const updatedTour = await this.tourService.updateTourById(
        id,
        updateTourDto,
      );
      res.status(200).json(updatedTour);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'Error updating tour', error: err.message });
    }
  }

  /**
   * Retrieves a tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public async getTourById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const tour = await this.tourService.getTourById(id);
      if (!tour) {
        res.status(404).json({ message: 'Tour not found' });
        return;
      }
      res.status(200).json(tour);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'Error retrieving tour', error: err.message });
    }
  }

  /**
   * Retrieves all tours.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public async getAllTours(req: Request, res: Response) {
    try {
      console.log(req.query);

      const queryObj = { ...req.query };
      const excludedFields = ['page', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      const tours = await this.tourService.getAllTours(queryObj);
      res.status(200).json(tours);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'Error retrieving tours', error: err.message });
    }
  }

  /**
   * Deletes a tour by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
  public async deleteTourById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedTour = await this.tourService.deleteTourById(id);
      res.status(200).json(deletedTour);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'Error deleting tour', error: err.message });
    }
  }
}
