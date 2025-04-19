import prisma from '../../config/prisma-client';
import { ITour } from '../../interfaces/tour.interface';
import { CreateTourDto, UpdateTourDto } from '../dto/tour.dto';

export class TourService {
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
    const whereClause: any = { where: { AND: [] } };

    if (queryParams.duration) {
      whereClause.where.AND.push({ duration: parseInt(queryParams.duration) });
    }
    if (queryParams.difficulty) {
      whereClause.where.AND.push({ difficulty: queryParams.difficulty });
    }

    if (whereClause.where.AND.length === 0) {
      delete whereClause.where;
    }

    const tours = await prisma.tour.findMany(whereClause);
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
