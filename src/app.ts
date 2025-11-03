import express, { Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
import { createCustomError } from './utils/apiError';
import { errorHandler } from './middlewares/errorHandler';
const app = express();

//1_global middlewares

/**
 * Set security HTTP headers
 */
app.use(helmet());

/**
 * logger
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Limit requests from same API
 **/
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

/**
 * Prevent parameter pollution (repating para's name)
 */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(express.json({ limit: '10kb' })); //modify incoming request cause it undefined without this
app.use(express.static(path.join(__dirname, '../public')));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

/**
 * API endpoints
 */
import tourRouter from './routes/tour.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

/**
 *  handle all http requests (get | post | put  | patch | delete) which not found
 */
app.all('*', (req, res, next) => {
  next(createCustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global error handler
 */
app.use(errorHandler);

export default app;
