import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  result: {
    tour: {
      durationWeeks: {
        needs: { duration: true },
        compute(tour) {
          return tour.duration / 7;
        },
      },
    },
  },
  query: {
    tour: {
      async findMany({ args, query }) {
        args.where = { ...args.where, secretTour: { not: true } };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, secretTour: { not: true } };
        return query(args);
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        return result?.secretTour ? null : result;
      },
    },
  },
});

export default prisma;
