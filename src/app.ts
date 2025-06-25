import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tour.route';
import userRouter from './routes/user.route';
import path from 'path';
import { createCustomError } from './utils/apiError';
const app = express();

//1_global middlewares
if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev')); //logger
}

app.use(express.json()); //modify in coming request cause it undefined without this
app.use(express.static(path.join(__dirname, '../public')));

app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//handle all http requests (get | post | put  | patch | delete) which not found
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  const err: any = new Error();
  err.status = 'fail';
  err.statusCode = 404;
  next(createCustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errror';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
export default app;
