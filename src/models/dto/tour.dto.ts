import { ITour } from '../../interfaces/tour.interface';

export class CreateTourDto implements ITour {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number | null;
  summary: string;
  description?: string | null;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;

  constructor(bodyRequest: ITour) {
    this.name = bodyRequest.name;
    this.duration = bodyRequest.duration;
    this.maxGroupSize = bodyRequest.maxGroupSize;
    this.difficulty = bodyRequest.difficulty;
    this.ratingsAverage = bodyRequest.ratingsAverage ?? 0;
    this.ratingsQuantity = bodyRequest.ratingsQuantity ?? 0;
    this.price = bodyRequest.price;
    this.priceDiscount = bodyRequest.priceDiscount;
    this.summary = bodyRequest.summary;
    this.description = bodyRequest.description;
    this.imageCover = bodyRequest.imageCover;
    this.images = bodyRequest.images ?? [];
    this.createdAt = bodyRequest.createdAt ?? new Date();
    this.startDates = bodyRequest.startDates;
    this.secretTour = bodyRequest.secretTour ?? false;
  }
}

export class UpdateTourDto implements Partial<ITour> {
  name?: string;
  durations?: number;
  maxGroupSize?: number;
  difficulty?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price?: number;
  priceDiscount?: number;
  summary?: string;
  description?: string;
  imageCover?: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
  secretTour?: boolean;

  constructor(bodyRequest: Partial<ITour>) {
    Object.assign(this, bodyRequest);
  }
}
