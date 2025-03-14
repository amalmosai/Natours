import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
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

const filePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//2_handlers
const getAllTours = (req: Request, res: Response) => {
  console.log(req);
  res.status(200).json({
    status: 'success',
    dats: {
      tours,
    },
  });
};
const createTour = (req: Request, res: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(filePath, JSON.stringify(tours), 'utf8', (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};
const getTour = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const tour = tours.find((ele: any) => ele.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req: Request, res: Response) => {
  if (Number(req.params.id) > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
};
const deleteTour = (req: Request, res: Response) => {
  if (Number(req.params.id) > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
    return;
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};
const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined yet',
  });
};

//3_routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4_start server
const port = 3001;
app.listen(port, () => {
  console.log(`listen to port ${port}`);
});
