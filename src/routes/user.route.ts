import express from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../models/dao/user.dao';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router
  .route('/updateMe')
  .patch(authenticateUser, userController.updateMe.bind(userController));

router
  .route('/deleteMe')
  .delete(authenticateUser, userController.deleteMe.bind(userController));

router
  .route('/me')
  .get(authenticateUser, userController.getMe.bind(userController));

export default router;
