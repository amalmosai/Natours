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
});

export default prisma;
