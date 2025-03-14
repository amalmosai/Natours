import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tour.route';
import userRouter from './routes/user.route';

const app = express();

//1_middlewares
app.use(morgan('dev')); //logger

app.use(express.json()); //modify in coming request cause it undefined without this
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Hello from middleware`);
  next();
});

app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
