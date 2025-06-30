import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../models/dao/auth.dao';

const router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.route('/signUp').post(authController.signup.bind(authController));

router.route('/login').post(authController.login.bind(authController));

export default router;
