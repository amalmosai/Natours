import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB, PORT } from './config/db';

//console.log(app.get('env')); //express variables
//console.log(process.env); //global node variables
// console.log(__dirname);
// console.log(__filename);

//4_start server

connectDB();
app.listen(PORT, () => {
  console.log(`listen to port ${PORT}`);
});
