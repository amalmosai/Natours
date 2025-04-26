import prisma from '../../config/prisma-client';
import { ITour } from '../../interfaces/tour.interface';
import { TourQueryBuilder } from '../../utils/apiFeatures';
import { CreateTourDto, UpdateTourDto } from '../dto/tour.dto';

export class TourService {
  //Repository Pattern
  /**
   * Creates a new tour in the database.
   * @param {CreateTourDto} createTourDto - The data for the new tour.
   * @returns {Promise<ITour>} The created tour.
   */
  public async createTour(createTourDto: CreateTourDto): Promise<ITour> {
    const tour = await prisma.tour.create({
      data: {
        ...createTourDto,
      },
    });
    return tour;
  }

  /**
   * Updates an existing tour by its ID.
   * @param {string} id - The ID of the tour to update.
   * @param {UpdateTourDto} updateTourDto - The data to update the tour with.
   * @returns {Promise<ITour>} The updated tour.
   */

  public async updateTourById(
    id: string,
    updateTourDto: UpdateTourDto,
  ): Promise<ITour> {
    const tour = await prisma.tour.update({
      where: { id },
      data: updateTourDto,
    });
    return tour;
  }

  /**
   * Retrieves a tour by its ID.
   * @param {string} id - The ID of the tour to retrieve.
   * @returns {Promise<ITour | null>} The found tour or null if not found.
   */

  public async getTourById(id: string): Promise<ITour | null> {
    const tour = await prisma.tour.findUnique({
      where: { id },
    });
    return tour;
  }

  /**
   * Retrieves all tours from the database.
   * @returns {Promise<ITour[]>} An array of all tours.
   */
  public async getAllTours(queryParams: any): Promise<ITour[]> {
    const queryOptions = new TourQueryBuilder(queryParams)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    //execution
    const tours = await prisma.tour.findMany(queryOptions);
    return tours;
  }

  /**
   * Deletes a tour by its ID.
   * @param {string} id - The ID of the tour to delete.
   * @returns {Promise<ITour>} The deleted tour.
   */

  public async deleteTourById(id: string): Promise<ITour> {
    const tour = await prisma.tour.delete({
      where: { id },
    });
    return tour;
  }
}
