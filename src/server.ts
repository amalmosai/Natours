import app from './app';

//4_start server
const port = 3001;
app.listen(port, () => {
  console.log(`listen to port ${port}`);
});
