import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const filePath = path.join(
  __dirname,
  '..',
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));

export const checkId = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Tour id id :${req.params.id}`);
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  next();
};

export const checkBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.name || !req.body.price) {
    res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
    return;
  }
  next();
};

export const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    dats: {
      tours,
    },
  });
};

export const createTour = (req: Request, res: Response) => {
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

export const getTour = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const tour = tours.find((ele: any) => ele.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
