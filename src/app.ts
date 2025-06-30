import express, { Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import { createCustomError } from './utils/apiError';
import { errorHandler } from './middlewares/errorHandler';
const app = express();

//1_global middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logger
}

app.use(express.json()); //modify in coming request cause it undefined without this
app.use(express.static(path.join(__dirname, '../public')));

app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

import tourRouter from './routes/tour.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

//handle all http requests (get | post | put  | patch | delete) which not found
app.all('*', (req, res, next) => {
  next(createCustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
