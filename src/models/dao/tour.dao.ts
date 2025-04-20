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
    const queryOptions: any = { where: { AND: [] } };
    //sort
    if (queryParams.sort) {
      const sortParams = queryParams.sort.split(','); //price:desc,ratingAverage:asc
      queryOptions.orderBy = sortParams.map(
        (param: { split: (arg0: string) => [any, any] }) => {
          const [fieldName, order] = param.split(':');
          return {
            [fieldName]: order === 'desc' ? 'desc' : 'asc',
          };
        },
      );
    } else {
      queryOptions.orderBy = { createdAt: 'desc' };
    }
    //filtering
    if (queryParams.duration) {
      const durationCondition: any = {};

      if (queryParams.duration.gt) {
        durationCondition.gt = parseInt(queryParams.duration.gt);
      }
      if (queryParams.duration.gte) {
        durationCondition.gte = parseInt(queryParams.duration.gte);
      }
      if (queryParams.duration.lt) {
        durationCondition.lt = parseInt(queryParams.duration.lt);
      }
      if (queryParams.duration.lte) {
        durationCondition.lte = parseInt(queryParams.duration.lte);
      }
      if (queryParams.duration.equals) {
        durationCondition.equals = parseInt(queryParams.duration.equals);
      }
      // Only add duration condition if at least one operator was provided
      if (Object.keys(durationCondition).length > 0) {
        queryOptions.where.AND.push({ duration: durationCondition });
      }
    }
    if (queryParams.difficulty) {
      queryOptions.where.AND.push({ difficulty: queryParams.difficulty });
    }

    if (queryOptions.where.AND.length === 0) {
      delete queryOptions.where;
    }
    //limit
    if (queryParams.limit) {
      queryOptions.take = parseInt(queryParams.limit);
    }

    //selected fields
    if (queryParams.fields) {
      const fieldsParams = queryParams.fields.split(',');
      // queryOptions.select = {};
      queryOptions.omit = {};
      fieldsParams.forEach((param: any) => {
        if (param.startsWith('-')) {
          const fieldToExclude = param.slice(1);
          queryOptions.omit[fieldToExclude] = true;
        } else {
          // queryOptions.select[param] = true;
        }
      });
    }
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
