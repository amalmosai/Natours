import express from 'express';
import fs from 'fs';
import path from 'path';
const app = express();

app.use(express.json()); //modify in coming request cause it undefined without this

const filePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    dats: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((ele: any) => ele.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (Number(req.params.id) > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (Number(req.params.id) > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`listen to port ${port}`);
});
