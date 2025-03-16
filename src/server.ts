import dotenv from 'dotenv';
dotenv.config();

import app from './app';

//console.log(app.get('env')); //express variables
//console.log(process.env); //global node variables

//4_start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listen to port ${port}`);
});
