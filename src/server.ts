import dotenv from 'dotenv';
dotenv.config();

/**
 * Global uncaught exception handler
 * Catches synchronous errors that bubble up to the event loop without being handled
 */
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

import app from './app';
import { connectDB, PORT } from './config/db';

//console.log(app.get('env')); //express variables
//console.log(process.env); //global node variables
// console.log(__dirname);
// console.log(__filename);

//4_start server

connectDB();
const server = app.listen(PORT, () => {
  console.log(`listen to port ${PORT}`);
});

/**
 * Global unhandled promise rejection handler
 * This catches any promise rejections that weren't properly handled in the code
 */
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
